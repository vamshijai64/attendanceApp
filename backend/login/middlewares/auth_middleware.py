from functools import wraps
from flask import request, jsonify
import jwt
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()

secret_key = os.getenv('SECRET_KEY')

blacklisted_tokens = set()  # Store invalidated tokens

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if token in blacklisted_tokens:
            return jsonify({"message": "Token has been invalidated. Please log in again."})
        
        # Check if the token is provided in the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Extract token

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            # Decode the token
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            request.email = data['email'] # Pass email to the route
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 401
        
        return f(*args, **kwargs)
    return decorated

def generate_token(email):
    try:
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=1) # Token valid for 1 hour
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token
    except Exception as e:
        print(f"Error generating token: {e}")
        return None