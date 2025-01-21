from flask import Blueprint
from attendance.controllers.attendance_controller import (
    mark_checkin, mark_checkout, delete_attendance,
    get_attendance_by_employee, get_all_attendance, mark_leave
)

attendance_routes = Blueprint('attendance_routes', __name__)

# Attendance routes
attendance_routes.route('/attendance/checkin', methods=['POST'])(mark_checkin)
attendance_routes.route('/attendance/checkout', methods=['PUT'])(mark_checkout)
attendance_routes.route('/attendance/delete/<employee_id>', methods=['DELETE'])(delete_attendance)
attendance_routes.route('/attendance/<employee_id>', methods=['GET'])(get_attendance_by_employee)
attendance_routes.route('/attendance', methods=['GET'])(get_all_attendance)
attendance_routes.route('/attendance/leave', methods=['POST'])(mark_leave)