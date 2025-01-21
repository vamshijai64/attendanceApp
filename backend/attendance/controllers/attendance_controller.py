from flask import request, jsonify
from attendance.services.attendance_service import (
    mark_checkin_service, mark_checkout_service, delete_attendance_service, 
    get_attendance_by_employee_service, get_all_attendance_service, mark_leave_service
)

from attendance.middlewares.validations import format_current_date
from login.middlewares.auth_middleware import token_required

@token_required
def mark_checkin():
    try:
        data = request.json
        result = mark_checkin_service(data)
        # Extract message, data, and status from the result
        message = result.get('message')
        data = result.get('data') # Only get 'data' if it exists
        status = result.get('status', 500)
        
        # If 'data' is None or empty, do not include it in the response
        if not data:
            response = {"message": message}
        else:
            response = {"message": message, "data": data}

        # Return full response
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def mark_checkout():
    try:
        data = request.json
        result = mark_checkout_service(data)
        message = result.get('message')
        data = result.get('data')
        status = result.get('status', 500)

        if not data:
            response = {"message": message}
        else:
            response = {"message": message, "data": data}

        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def delete_attendance(employee_id):
    try:
        date = request.args.get("date", format_current_date())
        result = delete_attendance_service(employee_id, date)
        message = result.get('message')
        status = result.get('status', 500)
        return jsonify({"message": message}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def get_attendance_by_employee(employee_id):
    try:
        date = request.args.get("date")
        status = request.args.get("status")
        month = request.args.get("month")
        year = request.args.get("year")

        result = get_attendance_by_employee_service(employee_id, date, status, month, year)
        message = result.get('message')
        data = result.get('data', [])
        status = result.get('status', 500)

        # If data is empty (no attendance records), do not include 'data' in the response
        if not data:
            response = {"message": message}
        else:
            response = {"message": message, "data": data}

        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def get_all_attendance():
    try:
        date= request.args.get("date")
        status = request.args.get("status")
        month = request.args.get("month")
        year = request.args.get("year")
        
        result = get_all_attendance_service(date, status, month, year)
        message = result.get('message')
        data = result.get('data', [])
        status = result.get('status', 500)

        if not data:
            response = {"message": message}
        else:
            response = {"message": message, "data": data}

        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def mark_leave():
    try:
        data = request.json
        result = mark_leave_service(data)
        message = result.get('message')
        data = result.get('data')
        status = result.get('status', 500)

        if not data:
            response = {"message": message}
        else:
            response = {"message": message, "data": data}

        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500