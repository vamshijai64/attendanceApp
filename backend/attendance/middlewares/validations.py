# from attendance.config.database import get_attendance_database
from configs.database import get_attendance_database
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

# Get the database
attendance_db = get_attendance_database()

# Access the variables
collection_name = os.getenv("COLLECTION")
attendance = os.getenv("ATTENDANCE")
counter = os.getenv("COUNTER")

collection = attendance_db[collection_name]
attendance_collection = attendance_db[attendance]
counter_collection = attendance_db[counter]


def validate_employee(employee_id):
    employee = collection.find_one({"Employee_ID": {"$regex": f"^{employee_id}$", "$options": "i"}})
    if not employee:
        return None, {"message": f"Employee with ID {employee_id} not found"}
    return employee, None

def check_existing_record(field, value):
    return collection.find_one({field: value})

def check_existing_attendance(employee_id, current_date, status=None):
    query = {
        "Employee_ID": {"$regex": f"^{employee_id}$", "$options": "i"},
        "Date": current_date
    }
    if status:
        query["Status"] = status  # Add status to the query if provided
    return attendance_collection.find_one(query)

def format_current_date():
    return datetime.today().strftime('%Y-%m-%d')

def format_current_time():
    return datetime.now().strftime('%H:%M:%S')