from flask import Blueprint, request
from models import db, Pharmacy, SystemActivity
from utils.responses import success_response, error_response

pharmacies_bp = Blueprint('pharmacies', __name__)

@pharmacies_bp.route('/', methods=['GET'])
def get_pharmacies():
    pharmacies = Pharmacy.query.order_by(Pharmacy.created_at.desc()).all()
    return success_response(data=[p.to_dict() for p in pharmacies])

@pharmacies_bp.route('/', methods=['POST'])
def create_pharmacy():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('name') or not data.get('password'):
        return error_response("Missing required fields", status_code=400)
    
    if Pharmacy.query.filter_by(email=data['email']).first():
        return error_response("Pharmacy with this email already exists", status_code=400)
    
    new_pharmacy = Pharmacy(
        name=data['name'],
        email=data['email'],
        license_no=data.get('license_no'),
        owner=data.get('owner'),
        address=data.get('address'),
        city=data.get('city'),
        phone=data.get('phone')
    )
    new_pharmacy.set_password(data['password'])
    
    db.session.add(new_pharmacy)
    
    # Log Activity
    log = SystemActivity(
        user="Admin",
        action=f"onboarded {new_pharmacy.name}",
        avatar="AD"
    )
    db.session.add(log)
    
    db.session.commit()
    
    return success_response(data=new_pharmacy.to_dict(), message="Pharmacy registered successfully", status_code=201)

@pharmacies_bp.route('/<int:id>', methods=['PUT', 'DELETE', 'GET'])
def manage_pharmacy(id):
    pharmacy = Pharmacy.query.get_or_404(id)
    
    if request.method == 'GET':
        return success_response(data=pharmacy.to_dict())
    
    if request.method == 'DELETE':
        db.session.delete(pharmacy)
        log = SystemActivity(
            user="Admin",
            action=f"removed {pharmacy.name} from partners",
            avatar="AD"
        )
        db.session.add(log)
        db.session.commit()
        return success_response(message="Pharmacy removed successfully")
    
    # PUT
    data = request.get_json()
    pharmacy.name = data.get('name', pharmacy.name)
    pharmacy.email = data.get('email', pharmacy.email)
    pharmacy.license_no = data.get('license_no', pharmacy.license_no)
    pharmacy.owner = data.get('owner', pharmacy.owner)
    pharmacy.address = data.get('address', pharmacy.address)
    pharmacy.city = data.get('city', pharmacy.city)
    pharmacy.phone = data.get('phone', pharmacy.phone)
    
    if 'password' in data and data['password']:
        pharmacy.set_password(data['password'])
        
    db.session.commit()
    return success_response(data=pharmacy.to_dict(), message="Pharmacy updated successfully")
