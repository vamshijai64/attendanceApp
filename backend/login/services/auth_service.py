from login.models.manager_model import Manager
from login.services.otp_service import generate_otp, validate_otp
from login.services.email_service import send_otp_email
# from login.config.database import get_database
from configs.database import get_database
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash
from login.middlewares.auth_middleware import generate_token, blacklisted_tokens
from flask import request

load_dotenv()

secret_key = os.getenv('SECRET_KEY')

db = get_database()
managers_collection = db[os.getenv('Manager_Info')]


def login_service(data):
    email = data.get('email')
    password = data.get('password')

    manager = managers_collection.find_one({'email': email})
    if not manager or not Manager.is_valid_password(manager['password'], password):
        return {"message": "Invalid email or password.", "status": 401}

    otp = generate_otp(email)
    if send_otp_email(email, otp):
        return {"message": f'OTP sent to {email}', "status": 200}
    return {"message": "Failed to send OTP.", "status": 500}

def update_password_service(data):
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    manager = managers_collection.find_one({'email': email})
    if not manager or not Manager.is_valid_password(manager['password'], old_password):
        return {"message": "Invalid email or password.", "status": 401}
    
    hashed_password = generate_password_hash(new_password)
    managers_collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
    return {'message': 'Password updated successfully.', "status": 200}

# Validate OTP
def validate_otp_service(data):
    email = data.get('email')
    otp = data.get('otp')
    
    if validate_otp(email, otp):
        # Generate JWT token
        token = generate_token(email)
        if token:
            return {"message": "Login successful.", "token": token, "status": 200}
        return {"message": "Failed to generate token.", "status": 500}
    return {"message": "Invalid or expired OTP.", "status": 400}

# Forget Password - Request OTP
def forget_password_service(data):
    email = data.get('email')

    # Check if manager exists
    manager= managers_collection.find_one({'email': email})
    if not manager:
        return {"message": "Manager with this email does not exist.", "status": 404}
    
    # Generate OTP and send to the manager's email
    otp = generate_otp(email)
    if send_otp_email(email, otp):
        return {"message": f"OTP sent to {email}", "status": 200}
    return {"message": "Failed to send OTP.", "status": 500}

# Forget Password - Verify OTP and Reset Password
def reset_password_service(data):
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    # Validate the OTP
    if not validate_otp(email, otp):
        return {"message": "Invalid or expired OTP.", "status": 400}
    
    # Update the manager's password in the database
    hashed_password = generate_password_hash(new_password) # Hash the new password
    managers_collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
    return {"message": "Password reset successfully.", "status": 200}

# Logout
def logout_service(data, token):
    email = data.get('email')
    if token:
        blacklisted_tokens.add(token) # Add token to the blacklist
        return {"message": "Logout successful.", "status": 200}
    return {"message": "Logout failed.", "status": 400}

def protected_resource_service():
    return {"message": "Access granted!", "email": request.email, "status": 200}