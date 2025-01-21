# from attendance.config.custom import get_next_id
from configs.custom import get_next_id, counter_collection_db2
from bson import ObjectId
from attendance.middlewares.validations import ( 
    check_existing_record, collection
)

def create_record_service(data):
    if check_existing_record('Employee_ID', data.get('Employee_ID')):
        return {"message": "Employee ID already exists.", "status": 409} # Conflict (Duplicate entry)
    
    new_id = get_next_id("Employee_IDs", counter_collection_db2)
    data['_id'] = new_id
    collection.insert_one(data)
    return {"message": "Record saved successfully.", "data": data, "status": 201}

def update_values_service(updated_data, key, value):
    existing_record = collection.find_one({key: value})
    if not existing_record:
        return {"message": "Record not found.", "status": 404}
    
    if updated_data.get("Email") and updated_data["Email"] != existing_record.get("Email"):
        duplicate_email = collection.find_one({"Email": updated_data["Email"]})
        if duplicate_email:
            return {"message": "Email already exists.", "status": 409}
        
    result = collection.update_one({key: value}, {'$set': updated_data})
    if result.matched_count:
        updated_record = collection.find_one({key: value})
        return {"message": "Record updated successfully.", "data": updated_record, "status": 200}
    return {"message": "Record not found.", "status": 404}

def read_all_records_service():
    records = list(collection.find())
    if records:
        return {"data": records, "status": 200}
    return {"message": "No records found", "status": 204}

def read_record_by_id_service(key, value):
    # Handle case-insensitive search for specific fields
    if key in 'Employee_ID':
        value = {'$regex': f"^{value}$", "$options": "i"}

    record = collection.find_one({key: value})
    if record:
        if "_id" in record and isinstance(record["_id"], ObjectId):
            record["_id"] = str(record(["_id"]))
        return {"data": record, "status": 200}
    return {"message": f"Record not found for given ID.", "status": 404}