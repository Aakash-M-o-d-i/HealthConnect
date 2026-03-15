from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import random
from models import db, User, MedicalRecord, Prescription, Visit
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

# Load environment variables
load_dotenv()

def generate_uhid():
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    part1 = ''.join(random.choices(chars, k=4))
    part2 = ''.join(random.choices(chars, k=4))
    return f"HID-{part1}-{part2}"

def create_app():
    # Serve static files from the React frontend build folder
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    app = Flask(__name__, static_folder=frontend_dist)
    CORS(app)

    db_name = os.getenv('DB_NAME', 'healthconnect.db')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_name}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')

    db.init_app(app)
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api/'):
            return jsonify({"message": "API endpoint not found"}), 404
        
        # Check if the path is a real static file (e.g. assets/main.js)
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
            
        # Otherwise, return index.html for React Router to handle
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/api')
    def api_index():
        return jsonify({"message": "HealthConnect API Root endpoint"})

    # --- Authentication Routes ---
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.json
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"message": "Missing required fields"}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400

        dob = datetime.strptime(data.get('dob'), '%Y-%m-%d').date() if data.get('dob') else None

        new_user = User(
            name=data.get('name', ''),
            email=data['email'],
            phone=data.get('phone'),
            dob=dob,
            gender=data.get('gender'),
            blood_group=data.get('blood_group'),
            govt_id=data.get('govt_id'),
            health_id=generate_uhid()
        )
        new_user.set_password(data['password'])
        
        try:
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=str(new_user.id))
            return jsonify({"message": "User created successfully", "token": access_token, "user": new_user.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to create user", "error": str(e)}), 500

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.json
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"message": "Missing required fields"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"message": "Login successful", "token": access_token, "user": user.to_dict()}), 200

        return jsonify({"message": "Invalid email or password"}), 401

    # --- Patient Routes ---
    @app.route('/api/patient/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        return jsonify(user.to_dict()), 200

    @app.route('/api/patient/profile', methods=['PATCH'])
    @jwt_required()
    def update_profile():
        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        data = request.json
        updateable_fields = ['name', 'phone', 'gender', 'blood_group', 'address', 'city', 'state', 'pincode', 'emergency_contact']
        
        for field in updateable_fields:
            if field in data:
                setattr(user, field, data[field])
                
        if 'dob' in data and data['dob']:
            try:
                user.dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
            except ValueError:
                pass # Invalid date format
                
        if 'allergies' in data:
            user.set_allergies(data['allergies'])
        if 'chronic_conditions' in data:
            user.set_chronic_conditions(data['chronic_conditions'])
            
        try:
            db.session.commit()
            return jsonify({"message": "Profile updated successfully", "user": user.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update profile", "error": str(e)}), 500

    @app.route('/api/patient/stats', methods=['GET'])
    @jwt_required()
    def get_stats():
        user_id = int(get_jwt_identity())
        
        records_count = MedicalRecord.query.filter_by(patient_id=user_id).count()
        prescriptions_count = Prescription.query.filter_by(patient_id=user_id).count()
        visits_count = Visit.query.filter_by(patient_id=user_id).count()
        
        # Simple dynamic health score calculation
        health_score = 0
        if records_count > 0 or prescriptions_count > 0 or visits_count > 0:
            # Provide some base score + points per interaction, maxing out at 100
            calculated_score = 75 + (records_count * 2) + (visits_count * 2) - (prescriptions_count * 3)
            # Ensure it stays between 0 and 100
            health_score = max(0, min(100, calculated_score))
        
        return jsonify({
            "medical_records": records_count,
            "prescriptions": prescriptions_count,
            "upcoming_visits": visits_count, # Filtering only future visits can be implemented here
            "health_score": health_score
        }), 200

    @app.route('/api/patient/records', methods=['GET'])
    @jwt_required()
    def get_records():
        user_id = int(get_jwt_identity())
        records = MedicalRecord.query.filter_by(patient_id=user_id).order_by(MedicalRecord.date.desc()).all()
        return jsonify([r.to_dict() for r in records]), 200

    @app.route('/api/patient/prescriptions', methods=['GET'])
    @jwt_required()
    def get_prescriptions():
        user_id = int(get_jwt_identity())
        prescriptions = Prescription.query.filter_by(patient_id=user_id).order_by(Prescription.issue_date.desc()).all()
        return jsonify([p.to_dict() for p in prescriptions]), 200

    @app.route('/api/patient/visits', methods=['GET'])
    @jwt_required()
    def get_visits():
        user_id = int(get_jwt_identity())
        visits = Visit.query.filter_by(patient_id=user_id).order_by(Visit.date.desc()).all()
        return jsonify([v.to_dict() for v in visits]), 200

    # --- Search / General ---
    @app.route('/api/search/patient/<uhid>', methods=['GET'])
    def search_patient_by_uhid(uhid):
        user = User.query.filter_by(health_id=uhid).first()
        if not user:
            return jsonify({"message": "Patient not found"}), 404
        
        return jsonify({
            "name": user.name,
            "health_id": user.health_id,
            "blood_group": user.blood_group,
            "gender": user.gender,
            "age": datetime.utcnow().year - user.dob.year if user.dob else None
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
