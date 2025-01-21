# from attendance.config.database import get_attendance_database
from configs.database import get_database, get_attendance_database
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize databases
db = get_database()
attendance_db = get_attendance_database()

counter_colletion_name = os.getenv("COUNTER")

counter_collection_db1 = db[counter_colletion_name]
counter_collection_db2 = attendance_db[counter_colletion_name]


def get_next_id(counter_name, counter_collection):
    """
    Increment and retrieve the next ID for a given counter_name in the specified collection.
    
    Args:
        counter_name (str): The name of the counter to increment.
        counter_collection: The collection to perform the operation on.
        
    Returns:
        int: The next sequence number.
    """
    counter = counter_collection.find_one_and_update(
        {'_id': counter_name},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=True
    )
    if not counter:
        # If the document doesn't exist, ensure seq starts from 1
        counter_collection.update_one(
            {'_id': counter_name},
            {'$set': {'seq': 1}},
            upsert=True
        )
        return 1
    return counter['seq']