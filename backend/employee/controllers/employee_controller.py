from flask import request, jsonify
from employee.services.employee_service import (
    create_record_service, update_values_service, read_all_records_service, read_record_by_id_service
)

from login.middlewares.auth_middleware import token_required

@token_required
def create_record():
    try:
        data = request.json
        result = create_record_service(data)
        status = result.get('status', 500)  # Default to 500 if status is not provided

        if status == 201:  # Record created successfully
            return jsonify({"message": result.get("message"), "data": result.get("data")}), status
        else:  # Error or conflict
            return jsonify({"message": result.get("message")}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def update_values(key, value):
    try:
        updated_data = request.json
        result = update_values_service(updated_data, key, value)
        status = result.get('status', 500)
        
        if status == 200:  # Record updated successfully
            return jsonify({"message": result.get("message"), "data": result.get("data")}), status
        else:  # Record not found or conflict
            return jsonify({"message": result.get("message")}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def read_all_records():
    try:
        result = read_all_records_service()
        status = result.get('status', 500)

        if status == 200:  # Records found
            return jsonify({"data": result.get("data")}), status
        else:  # No records found
            return jsonify({"message": result.get("message")}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@token_required
def read_record_by_id(key, value):
    try:
        result = read_record_by_id_service(key, value)
        status = result.get('status', 500)
        
        if status == 200:  # Record found
            return jsonify({"data": result.get("data")}), status
        else:  # Record not found
            return jsonify({"message": result.get("message")}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500