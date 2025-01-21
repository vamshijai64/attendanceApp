from flask import request, jsonify
from login.models.manager_model import Manager
# from login.config.database import get_database
from configs.database import get_database
from configs.custom import get_next_id, counter_collection_db1
from dotenv import load_dotenv
import os
# from login.config.custom import get_next_id
from login.services.auth_service import (
    validate_otp_service, update_password_service , logout_service, 
    login_service, forget_password_service, reset_password_service, protected_resource_service
)
from login.middlewares.auth_middleware import token_required

load_dotenv()

db = get_database()
managers_collection = db['managers']
managers_collection = db[os.getenv('Manager_Info')]

# Initialize manager credentials
def init_manager():
    manager_email = os.getenv("receiver_email")
    manager_password = os.getenv("receiver_password")
    manager = Manager(manager_email, manager_password)
    if not managers_collection.find_one({'email': manager.email}):
        managers_collection.insert_one({
            "_id": get_next_id('ManagerIDs', counter_collection_db1),
            'email': manager.email,
            'password': manager.password,
        })
        print("Manager initialized.")
init_manager()

# Login with email and password
def login_controller():
    try:
        data = request.json
        result = login_service(data)
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@token_required
def update_password_controller():
    try:
        data = request.json
        result = update_password_service(data)
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Validate OTP
def validate_otp_controller():
    try:
        data = request.json
        result = validate_otp_service(data)
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 401)  # Default to 500 if status is not provided
        # return jsonify({"message": message}), status
        token = result.get('token', None)

        response = {"message": message}
        if token:
            response['token'] = token
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def forget_password_controller():
    try:
        data = request.json
        result = forget_password_service(data)
        # return jsonify(result)
        # Extract the status code from the service response or set a default
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def reset_password_controller():
    try:
        data = request.json
        result = reset_password_service(data)
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Logout
@token_required
def logout_controller():
    try:
        data = request.json
        token = request.headers.get('Authorization')
        result = logout_service(data, token)
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@token_required
def protected_resource_controller():
    try:
        result = protected_resource_service()
        # return jsonify(result)
        message = result.get('message')
        status = result.get('status', 500)  # Default to 500 if status is not provided
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500