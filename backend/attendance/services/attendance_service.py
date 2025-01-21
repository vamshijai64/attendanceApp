from configs.custom import get_next_id, counter_collection_db2
from datetime import datetime
from attendance.middlewares.validations import ( 
    validate_employee, check_existing_attendance, 
    format_current_date, format_current_time, collection, attendance_collection
)

def mark_checkin_service(data):
    employee_id = data.get("Employee_ID")
    status = data.get("Status", "Present")
    current_date = data.get("Date", format_current_date())
    current_time = format_current_time()

    employee, error = validate_employee(employee_id)
    if error:
        return {"message": error["message"], "status": 400}
    
    existing_record = check_existing_attendance(employee_id, current_date)
    if existing_record:
        return {"message": f"Attendance already recorded as {existing_record['Status']} for today", "data": existing_record, "status": 409}
    
    attendance_id = get_next_id("Attendance_IDs", counter_collection_db2)
    if status.lower() == 'absent':
        new_attendance = {
            "_id": attendance_id, "Attendance_ID": attendance_id, 
            "Employee_ID": employee_id, "Date": current_date, "Status": "Absent"
        }
        attendance_collection.insert_one(new_attendance)
        return {"message": "Employee marked as Absent", "data": new_attendance, "status": 201}
    
    new_attendance = {
        "_id": attendance_id, "Attendance_ID": attendance_id, "Employee_ID": employee_id,
        "Date": current_date, "Check-In": current_time, "Status": status
    }
    attendance_collection.insert_one(new_attendance)
    return {"message": "Check-in successful" ,"data": new_attendance, "status": 201}


def mark_checkout_service(data):
    employee_id = data.get("Employee_ID")
    current_date = format_current_date()
    check_out_time = format_current_time()

    employee, error = validate_employee(employee_id)
    if error:
        return {"message": error["message"], "status": 400}
    
    attendance_record = check_existing_attendance(employee_id, current_date)
    
    if not attendance_record:
        return {"message": "Attendance not found for today.", "status": 404}
    
    if "Check-In" not in attendance_record:
        return {"message": "Cannot check out. Employee hasn't checked in yet.", "status": 400}
    
    # if attendance_record.get("Status", "").lower() == "absent":
    #     return {"message": "Cannot check out. Employee is marked Absent for today."}
    
    if "Check-Out" in attendance_record:
        return {"message": "Check-Out already recorded", "data": attendance_record, "status": 409}
    
    attendance_collection.update_one(
        {"Employee_ID": employee_id, "Date": current_date},
        {"$set": {"Check-Out": check_out_time}} #, "Status": data.get("Status")
    )

    updated_record = attendance_collection.find_one({"Employee_ID": employee_id, "Date": current_date})
    return {"message": "Check-out successful", "data": updated_record, "status": 200}

def delete_attendance_service(employee_id, date):
    employee, error = validate_employee(employee_id)
    if error:
        return {"message": error["message"], "status": 400}

    attendance_record = check_existing_attendance(employee_id, date)
    if not attendance_record:
        return {"message": f"No attendance record found for Employee ID {employee_id} on {date}.", "status": 404}
    
    attendance_collection.delete_one({"Employee_ID": {"$regex": f"^{employee_id}$", "$options": "i"}, "Date": date})
    return {"message": f"Attendance record for Employee ID {employee_id} on {date} deleted successfully.", "status": 200}

def get_attendance_by_employee_service(employee_id, date, status, month, year):   
    if not month or not year:
        now = datetime.now()
        month = month or str(now.month).zfill(2)
        year = year or str(now.year)

    if int(month) < 1 or int(month) > 12:
        return {"message": "Invalid month parameter.", "status": 400}
    if len(year) != 4:
        return{"message": "Invalid year parameter.", "status": 400}
    
    employee = collection.find_one({"Employee_ID": {"$regex": f"^{employee_id}", "$options": "i"}})
    if not employee:
        return {"message": f"Employee with {employee_id} not found.", "status": 404}
    
    query = {"Employee_ID": {"$regex": f"^{employee_id}", "$options": "i"}}
    if date:
        query["Date"] = date
    else:
        query["Date"] = {"$regex": f"^{year}-{month.zfill(2)}"}
    if status:
        query["Status"] = status

    records = list(attendance_collection.find(query))
    if not records:
        return {"message": "No attendance records found for this query", "status": 404}
    return {"message": "Attendance records found successfully", "data": records, "status": 200}

def get_all_attendance_service(date, status, month, year):
    if not month or not year:
        now = datetime.now()
        month = month or str(now.month).zfill(2)
        year = year or str(now.year)

    if int(month) < 1 or int(month) > 12:
        return {"message": "Invalid month parameter.", "status": 400}
    if len(year) !=4:
        return {"message": "Invalid year parameter.", "status": 400}

    query = {}
    if date:
        query["Date"] = date
    else:
        query["Date"] = {"$regex": f"^{year}-{month.zfill(2)}"}
    if status:
        query["Status"] = status
    
    records = list(attendance_collection.find(query))
    return {"message": "Attendance records found successfully", "data": records, "status": 200}

def mark_leave_service(data):
    employee_id = data.get("Employee_ID")
    current_date = format_current_date()
    leave_type = data.get("Leave_Type")

    employee, error = validate_employee(employee_id)
    if error:
        return {"message": error["message"], "status": 400}
    
    existing_leave = check_existing_attendance(employee_id, current_date)
    if existing_leave:
        return {"message": "Leave or Check-In already marked for this employee on this date", "status": 409}
    
    custom_id = get_next_id("Attendance_IDs", counter_collection_db2)
    leave_record = {
        "_id": custom_id, "Attendance_ID": custom_id, "Employee_ID": employee_id,
        "Date": current_date, "Status": "Absent", "Leave_Type": leave_type
    }
    attendance_collection.insert_one(leave_record)
    return {"message": f"{leave_type} marked successfully for {employee_id}", "data": leave_record, "status": 201}