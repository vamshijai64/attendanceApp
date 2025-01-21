from flask import Blueprint
from employee.controllers.employee_controller import (
    create_record, update_values, read_all_records, read_record_by_id
)

employee_routes = Blueprint('employee_routes', __name__)

# CRUD operations for employees
employee_routes.route('/create', methods=['POST'])(create_record)
employee_routes.route('/update/<key>/<value>', methods=['PUT'])(update_values)
employee_routes.route('/read', methods=['GET'])(read_all_records)
employee_routes.route('/read/<key>/<value>', methods=['GET'])(read_record_by_id)