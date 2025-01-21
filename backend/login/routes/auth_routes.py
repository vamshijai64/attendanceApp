from flask import Blueprint
from login.controllers.auth_controller import (
    login_controller, update_password_controller, validate_otp_controller, 
    logout_controller, forget_password_controller, reset_password_controller,
    protected_resource_controller
)

auth_routes = Blueprint("auth_routes", __name__)

auth_routes.route('/login', methods=['POST'])(login_controller)

auth_routes.route('/update-password', methods=['POST'])(update_password_controller)

auth_routes.route('/validate-otp', methods=['POST'])(validate_otp_controller)

auth_routes.route('/forget-password', methods=['POST'])(forget_password_controller)
auth_routes.route('/reset-password', methods=['POST'])(reset_password_controller)

auth_routes.route('/logout', methods=['POST'])(logout_controller)

auth_routes.route('/protected-resource', methods=['GET'])(protected_resource_controller)