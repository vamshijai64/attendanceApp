from werkzeug.security import generate_password_hash, check_password_hash

class Manager:
    def __init__(self, email, password):
        self.email = email
        self.password = generate_password_hash(password)

    @staticmethod
    def is_valid_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
    

# class Employee:
#     def __init__(self, employee):
#         pass