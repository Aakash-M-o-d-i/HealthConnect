from flask import Blueprint, jsonify
from models import Doctor, Pharmacy, Staff, User, SystemActivity
from utils.responses import success_response

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    stats = {
        "total_doctors": Doctor.query.count(),
        "total_pharmacies": Pharmacy.query.count(),
        "total_staff": Staff.query.count(),
        "total_patients": User.query.count(),
        "system_health": "99.9%"
    }
    return success_response(data=stats)

@admin_bp.route('/activities', methods=['GET'])
def get_activities():
    activities = SystemActivity.query.order_by(SystemActivity.timestamp.desc()).limit(20).all()
    return success_response(data=[a.to_dict() for a in activities])
