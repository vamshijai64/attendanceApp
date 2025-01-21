import random
from datetime import datetime, timedelta

otp_storage = {}

def generate_otp(email):
    otp = random.randint(100000, 999999)
    otp_storage[email] = {
        'otp': otp,
        'expires_at': datetime.now() + timedelta(minutes=5)
    }
    return otp

def validate_otp(email, otp):
    if email in otp_storage:
        data = otp_storage[email]
        if datetime.now() < data['expires_at'] and data['otp'] == int(otp):
            del otp_storage[email]  # Clear OTP after successful validation
            return True
    return False