from flask import Flask
from waitress import serve
from login.routes.auth_routes import auth_routes
from employee.routes.employee_routes import employee_routes
from attendance.routes.attendance_routes import attendance_routes
import logging
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)

app = Flask(__name__)

CORS(app)

# Register Blueprints
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(attendance_routes, url_prefix='/api')
app.register_blueprint(employee_routes, url_prefix='/emp')

if __name__ == "__main__":
    serve(app, host="127.0.0.1", port=5000)