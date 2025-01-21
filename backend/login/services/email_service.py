import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

def send_otp_email(recipient_email, otp):
    sender_email = os.getenv("sender_email")
    sender_password = os.getenv("sender_password")

    message = MIMEText(f"Your OTP is: {otp}")
    message['Subject'] = "Login OTP"
    message['From'] = sender_email
    message['To'] = recipient_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(message)
        print("OTP sent successfully.")
        return True
    except Exception as e:
        print("Failed to send OTP:", e)
        return False