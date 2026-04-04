from flask import Blueprint, request
from models import db, Doctor, SystemActivity
from utils.responses import success_response, error_response

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.order_by(Doctor.created_at.desc()).all()
    return success_response(data=[d.to_dict() for d in doctors])

@doctors_bp.route('/', methods=['POST'])
def create_doctor():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('name') or not data.get('password'):
        return error_response("Missing required fields", status_code=400)
    
    if Doctor.query.filter_by(email=data['email']).first():
        return error_response("Doctor with this email already exists", status_code=400)
    
    new_doctor = Doctor(
        name=data['name'],
        specialization=data.get('specialization'),
        experience=data.get('experience', 'N/A'),
        email=data['email']
    )
    new_doctor.set_password(data['password'])
    
    db.session.add(new_doctor)
    
    # Log Activity
    log = SystemActivity(
        user=f"Admin",
        action=f"registered Dr. {new_doctor.name}",
        avatar="AD"
    )
    db.session.add(log)
    
    db.session.commit()
    
    return success_response(data=new_doctor.to_dict(), message="Doctor created successfully", status_code=201)

@doctors_bp.route('/<int:id>', methods=['PUT', 'DELETE', 'GET'])
def manage_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    
    if request.method == 'GET':
        return success_response(data=doctor.to_dict())
    
    if request.method == 'DELETE':
        db.session.delete(doctor)
        log = SystemActivity(
            user="Admin",
            action=f"removed Dr. {doctor.name} from the network",
            avatar="AD"
        )
        db.session.add(log)
        db.session.commit()
        return success_response(message="Doctor deleted successfully")
    
    # PUT
    data = request.get_json()
    doctor.name = data.get('name', doctor.name)
    doctor.specialization = data.get('specialization', doctor.specialization)
    doctor.experience = data.get('experience', doctor.experience)
    doctor.email = data.get('email', doctor.email)
    
    if 'password' in data and data['password']:
        doctor.set_password(data['password'])
        
    db.session.commit()
    return success_response(data=doctor.to_dict(), message="Doctor updated successfully")
