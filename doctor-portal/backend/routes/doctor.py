from flask import Blueprint, request, jsonify
from models import db, Doctor, User, MedicalRecord, Prescription, Visit
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import or_
from services.prescription_service import generate_rx_code

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/doctor/dashboard', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_dashboard():
    doctor_id = int(get_jwt_identity())
    doctor = db.session.get(Doctor, doctor_id)
    
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    # Calculate some stats for this doctor
    today = datetime.utcnow().date()
    
    # 1. total_patients_seen: Distinct patients this doctor has visited
    total_patients_seen = db.session.query(Visit.patient_id).filter_by(doctor_name=doctor.name).distinct().count()
    
    # 2. today_visits: Visits for today
    today_visits = Visit.query.filter_by(doctor_name=doctor.name, date=today).count()
    
    # 3. prescriptions_written: total prescriptions
    prescriptions_written = Prescription.query.filter_by(doctor_id=doctor.id).count()
    
    # We will fetch some recent appointments
    recent_appointments = Visit.query.filter_by(doctor_name=doctor.name).order_by(Visit.date.desc(), Visit.time.desc()).limit(10).all()

    return jsonify({
        "stats": {
            "total_patients_seen": total_patients_seen,
            "today_visits": today_visits,
            "prescriptions_written": prescriptions_written,
            "pending_tasks": 0 # Placeholder
        },
        "appointments": [v.to_dict() for v in recent_appointments]
    }), 200

@doctor_bp.route('/patients/search', methods=['GET'], strict_slashes=False)
@jwt_required()
def search_patients():
    query = request.args.get('q', '')
    if not query:
        return jsonify([]), 200

    patients = User.query.filter(
        or_(
            User.name.ilike(f'%{query}%'),
            User.phone.ilike(f'%{query}%'),
            User.health_id.ilike(f'%{query}%'),
            User.govt_id.ilike(f'%{query}%')
        )
    ).limit(20).all()

    return jsonify([p.to_dict() for p in patients]), 200

@doctor_bp.route('/patients/<string:uhid>', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_patient_details(uhid):
    doctor_id = int(get_jwt_identity())
    doctor = db.session.get(Doctor, doctor_id)
    
    patient = User.query.filter_by(health_id=uhid).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    # Fetch patient's past visits and prescriptions
    visits = Visit.query.filter_by(patient_id=patient.id).order_by(Visit.date.desc(), Visit.time.desc()).all()
    prescriptions = Prescription.query.filter_by(patient_id=patient.id).order_by(Prescription.issue_date.desc()).all()

    return jsonify({
        "profile": patient.to_dict(),
        "visit_history": [v.to_dict() for v in visits],
        "prescriptions": [p.to_dict() for p in prescriptions]
    }), 200

@doctor_bp.route('/visits', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_visit():
    doctor_id = int(get_jwt_identity())
    doctor = db.session.get(Doctor, doctor_id)
    
    data = request.json
    uhid = data.get('uhid')
    patient = User.query.filter_by(health_id=uhid).first()
    
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
        
    date_val = datetime.utcnow().date()
    time_val = datetime.utcnow().time()

    new_visit = Visit(
        patient_id=patient.id,
        doctor_name=doctor.name,
        facility=data.get('facility', 'HealthConnect Clinic'),
        date=date_val,
        time=time_val,
        diagnosis=data.get('diagnosis', 'Pending'),
        visit_type=data.get('type', 'General Checkup'),
        status=data.get('status', 'In Progress')
    )
    
    try:
        db.session.add(new_visit)
        db.session.commit()
        return jsonify(new_visit.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to record visit", "error": str(e)}), 500

@doctor_bp.route('/visits/<string:uhid>', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_visits(uhid):
    patient = User.query.filter_by(health_id=uhid).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
        
    visits = Visit.query.filter_by(patient_id=patient.id).order_by(Visit.date.desc()).all()
    return jsonify([v.to_dict() for v in visits]), 200

@doctor_bp.route('/prescriptions', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_prescription():
    doctor_id = int(get_jwt_identity())
    doctor = db.session.get(Doctor, doctor_id)
    
    data = request.json
    uhid = data.get('uhid')
    patient = User.query.filter_by(health_id=uhid).first()
    
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    rx_code = generate_rx_code()
    try:
        while Prescription.query.filter_by(rx_code=rx_code).first():
            rx_code = generate_rx_code()

        new_px = Prescription(
            patient_id=patient.id,
            doctor_id=doctor.id,
            rx_code=rx_code,
            doctor_name=doctor.name,
            facility=data.get('facility', 'HealthConnect Clinic'),
            issue_date=datetime.utcnow().date(),
            diagnosis=data.get('diagnosis', 'General Consultation'),
            status='pending',
            medicines=data.get('medicines', [])
        )
        
        db.session.add(new_px)

        # Update the most recent visit for today to 'Completed'
        latest_visit = Visit.query.filter_by(
            patient_id=patient.id, 
            doctor_name=doctor.name,
            date=datetime.utcnow().date()
        ).filter(Visit.status.in_(['In Progress', 'Waiting'])).order_by(Visit.created_at.desc()).first()
        
        if latest_visit:
            latest_visit.status = 'Completed'

        db.session.commit()
        return jsonify(new_px.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create prescription", "error": str(e)}), 500

@doctor_bp.route('/prescriptions/<string:uhid>', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_prescriptions(uhid):
    patient = User.query.filter_by(health_id=uhid).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
        
    prescriptions = Prescription.query.filter_by(patient_id=patient.id).order_by(Prescription.issue_date.desc()).all()
    return jsonify([p.to_dict() for p in prescriptions]), 200
