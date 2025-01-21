# from attendance.config.database import get_attendance_database
from configs.database import get_attendance_database
from dotenv import load_dotenv
import os

load_dotenv()

# Get the database
attendance_db = get_attendance_database()

# Access the variables
collection_name = os.getenv("COLLECTION")
counter = os.getenv("COUNTER")

collection = attendance_db[collection_name]
counter_collection = attendance_db[counter]

def check_existing_record(field, value):
    return collection.find_one({field: value})