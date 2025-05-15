# auth_routes.py
from flask import Blueprint, request, jsonify
from db_config import db  # Import db from db.py
from db.models import User  # Import the User model

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    # Check if email already exists in the database
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    # Create a new user
    new_user = User(email=email)
    new_user.set_password(password)  # Hash the password before saving

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists and if password is correct
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 400

    return jsonify({'message': 'Login successful'}), 200
