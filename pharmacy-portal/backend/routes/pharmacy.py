from flask import Blueprint, request, jsonify
from models import db, Pharmacy, Prescription, User, Doctor
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from services.pharmacy_service import generate_transaction_id

pharmacy_bp = Blueprint('pharmacy_bp', __name__)


@pharmacy_bp.route('/pharmacy/dashboard', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_dashboard():
    pharmacy_id = int(get_jwt_identity())
    pharmacy = db.session.get(Pharmacy, pharmacy_id)

    if not pharmacy:
        return jsonify({"message": "Pharmacy not found"}), 404

    today = datetime.utcnow().date()

    # Stats calculations
    verified_today = Prescription.query.filter(
        Prescription.dispensed_by == pharmacy.id,
        db.func.date(Prescription.dispensed_at) == today
    ).count()

    pending = Prescription.query.filter_by(status='pending').count()

    rejected = Prescription.query.filter(
        Prescription.dispensed_by == pharmacy.id,
        Prescription.status == 'rejected'
    ).count()

    total_dispensed = Prescription.query.filter_by(
        dispensed_by=pharmacy.id,
        status='dispensed'
    ).count()

    # Recent activity - last 10 dispensed/verified prescriptions
    recent_prescriptions = Prescription.query.filter(
        Prescription.dispensed_by == pharmacy.id
    ).order_by(Prescription.dispensed_at.desc()).limit(10).all()

    recent_activity = []
    for rx in recent_prescriptions:
        patient = db.session.get(User, rx.patient_id) if rx.patient_id else None
        medicines_summary = ", ".join(
            [m.get('name', '') for m in rx.get_medicines()]
        ) if rx.get_medicines() else "N/A"

        recent_activity.append({
            "rx_code": rx.rx_code,
            "patient_name": patient.name if patient else "Unknown",
            "doctor_name": rx.doctor_name or "Unknown",
            "medicines": medicines_summary,
            "time": rx.dispensed_at.strftime('%I:%M %p') if rx.dispensed_at else None,
            "status": rx.status.capitalize() if rx.status else "Unknown"
        })

    return jsonify({
        "stats": {
            "verified_today": verified_today,
            "pending": pending,
            "rejected": rejected,
            "total_dispensed": total_dispensed
        },
        "recent_activity": recent_activity
    }), 200


@pharmacy_bp.route('/pharmacy/verify/<string:rx_code>', methods=['GET'], strict_slashes=False)
@jwt_required()
def verify_prescription(rx_code):
    prescription = Prescription.query.filter_by(rx_code=rx_code).first()

    if not prescription:
        return jsonify({
            "status": "invalid",
            "message": "Prescription not found"
        }), 404

    # Check if already dispensed
    if prescription.status == 'dispensed':
        return jsonify({
            "status": "dispensed",
            "message": f"Already dispensed on {prescription.dispensed_at.strftime('%Y-%m-%d') if prescription.dispensed_at else 'unknown date'}"
        }), 200

    # Get patient and doctor details
    patient = db.session.get(User, prescription.patient_id) if prescription.patient_id else None
    doctor = db.session.get(Doctor, prescription.doctor_id) if prescription.doctor_id else None

    return jsonify({
        "status": "valid",
        "prescription": {
            "rx_code": prescription.rx_code,
            "patient": {
                "name": patient.name if patient else "Unknown",
                "health_id": patient.health_id if patient else None
            },
            "doctor": {
                "name": doctor.name if doctor else prescription.doctor_name or "Unknown",
                "specialization": doctor.specialization if doctor else None
            },
            "date": prescription.issue_date.strftime('%Y-%m-%d') if prescription.issue_date else None,
            "medicines": prescription.get_medicines(),
            "diagnosis": prescription.diagnosis,
            "notes": prescription.pharmacy_note
        }
    }), 200


@pharmacy_bp.route('/pharmacy/dispense/<string:rx_code>', methods=['POST'], strict_slashes=False)
@jwt_required()
def dispense_prescription(rx_code):
    pharmacy_id = int(get_jwt_identity())
    pharmacy = db.session.get(Pharmacy, pharmacy_id)

    if not pharmacy:
        return jsonify({"message": "Pharmacy not found"}), 404

    prescription = Prescription.query.filter_by(rx_code=rx_code).first()

    if not prescription:
        return jsonify({
            "status": "error",
            "message": "Prescription not found"
        }), 404

    if prescription.status == 'dispensed':
        return jsonify({
            "status": "error",
            "message": f"Prescription already dispensed on {prescription.dispensed_at.strftime('%Y-%m-%d') if prescription.dispensed_at else 'unknown date'}"
        }), 400

    try:
        # Generate unique transaction ID
        transaction_id = generate_transaction_id()
        while Prescription.query.filter_by(transaction_id=transaction_id).first():
            transaction_id = generate_transaction_id()

        # Update prescription status
        prescription.status = 'dispensed'
        prescription.dispensed_at = datetime.utcnow()
        prescription.dispensed_by = pharmacy.id
        prescription.transaction_id = transaction_id

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Prescription dispensed successfully",
            "transaction_id": transaction_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to dispense prescription",
            "error": str(e)
        }), 500


@pharmacy_bp.route('/pharmacy/profile', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_profile():
    pharmacy_id = int(get_jwt_identity())
    pharmacy = db.session.get(Pharmacy, pharmacy_id)

    if not pharmacy:
        return jsonify({"message": "Pharmacy not found"}), 404

    # Add computed stats to the profile
    profile = pharmacy.to_dict()

    total_prescriptions = Prescription.query.filter_by(dispensed_by=pharmacy.id).count()
    today = datetime.utcnow()
    first_of_month = today.replace(day=1).date()
    this_month = Prescription.query.filter(
        Prescription.dispensed_by == pharmacy.id,
        db.func.date(Prescription.dispensed_at) >= first_of_month
    ).count()

    # Calculate active since days
    active_since_days = 0
    if pharmacy.registration_date:
        active_since_days = (today.date() - pharmacy.registration_date).days

    profile["stats"] = {
        "total_prescriptions": total_prescriptions,
        "this_month": this_month,
        "active_since_days": active_since_days,
        "rating": pharmacy.rating or 0.0
    }

    return jsonify(profile), 200


@pharmacy_bp.route('/pharmacy/profile', methods=['PUT'], strict_slashes=False)
@jwt_required()
def update_profile():
    pharmacy_id = int(get_jwt_identity())
    pharmacy = db.session.get(Pharmacy, pharmacy_id)

    if not pharmacy:
        return jsonify({"message": "Pharmacy not found"}), 404

    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Only update editable fields (license_no, drug_license_no, gst_no, registration_date are read-only)
    editable_fields = [
        'name', 'owner', 'phone', 'mobile', 'email', 'website',
        'address', 'city', 'state', 'pincode', 'operating_hours',
        'pharmacist_in_charge', 'type'
    ]

    for field in editable_fields:
        if field in data:
            setattr(pharmacy, field, data[field])

    # Handle services (JSON field)
    if 'services' in data:
        pharmacy.set_services(data['services'])

    try:
        db.session.commit()
        return jsonify({
            "status": "success",
            "message": "Profile updated successfully"
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update profile",
            "error": str(e)
        }), 500
