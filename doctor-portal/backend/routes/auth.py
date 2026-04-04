from flask import Blueprint, request, jsonify
from models import db, Doctor
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'], strict_slashes=False)
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing required fields"}), 400

    doctor = Doctor.query.filter_by(email=data['email']).first()
    
    if doctor and doctor.check_password(data['password']):
        access_token = create_access_token(identity=str(doctor.id))
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "doctor": doctor.to_dict()
        }), 200

    return jsonify({"message": "Invalid email or password"}), 401
