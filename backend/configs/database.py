from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_database():
    database_url = os.getenv("DB_URL")
    database_name = os.getenv("DB_NAME")
    client = MongoClient(database_url)
    db = client[database_name]
    return db

def get_attendance_database():
    database_url = os.getenv("DB_URL")
    database_name = os.getenv("DB_NAME_ATT")
    client = MongoClient(database_url)
    db = client[database_name]
    return db