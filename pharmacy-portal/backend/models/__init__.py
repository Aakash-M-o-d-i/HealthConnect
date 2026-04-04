from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()


class Pharmacy(db.Model):
    __tablename__ = "pharmacies"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    license_no = db.Column(db.String(100), nullable=True)
    owner = db.Column(db.String(255), nullable=True)
    pharmacist_in_charge = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(100), nullable=True)
    address = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    mobile = db.Column(db.String(20), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    gst_no = db.Column(db.String(50), nullable=True)
    drug_license_no = db.Column(db.String(100), nullable=True)
    operating_hours = db.Column(db.String(255), nullable=True)
    services = db.Column(db.JSON, nullable=True)
    registration_date = db.Column(db.Date, nullable=True)
    rating = db.Column(db.Float, nullable=True, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        try:
            return check_password_hash(self.password_hash, password)
        except ValueError:
            return self.password_hash == password

    def get_services(self):
        return self.services if self.services else []

    def set_services(self, services_list):
        self.services = services_list

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "license_no": self.license_no,
            "owner": self.owner,
            "pharmacist_in_charge": self.pharmacist_in_charge,
            "type": self.type,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
            "phone": self.phone,
            "mobile": self.mobile,
            "website": self.website,
            "gst_no": self.gst_no,
            "drug_license_no": self.drug_license_no,
            "operating_hours": self.operating_hours,
            "services": self.get_services(),
            "registration_date": self.registration_date.strftime('%Y-%m-%d') if self.registration_date else None,
            "rating": self.rating
        }


class Doctor(db.Model):
    __tablename__ = "doctors"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    specialization = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "specialization": self.specialization,
            "email": self.email
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    blood_group = db.Column(db.String(5), nullable=True)
    govt_id = db.Column(db.String(50), nullable=True)
    health_id = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    emergency_contact = db.Column(db.Text, nullable=True)
    allergies = db.Column(db.JSON, nullable=True)
    chronic_conditions = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash == password:
            return True
        try:
            return check_password_hash(self.password_hash, password)
        except ValueError:
            return False

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "dob": self.dob.strftime('%Y-%m-%d') if self.dob else None,
            "gender": self.gender,
            "govt_id": self.govt_id,
            "health_id": self.health_id,
            "blood_group": self.blood_group,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
            "allergies": self.allergies if self.allergies else [],
            "chronic_conditions": self.chronic_conditions if self.chronic_conditions else [],
            "emergency_contact": self.emergency_contact
        }


class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    rx_code = db.Column(db.String(20), unique=True, nullable=False)
    doctor_name = db.Column(db.String(255), nullable=True)
    facility = db.Column(db.String(255), nullable=True)
    issue_date = db.Column(db.Date, nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=True, default="pending")
    medicines = db.Column(db.JSON, nullable=True)
    pharmacy_note = db.Column(db.Text, nullable=True)
    transaction_id = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=True)
    dispensed_at = db.Column(db.DateTime, nullable=True)
    dispensed_by = db.Column(db.Integer, db.ForeignKey('pharmacies.id'), nullable=True)

    patient = db.relationship('User', backref=db.backref('prescriptions', lazy=True, cascade="all, delete-orphan"))
    doctor = db.relationship('Doctor', backref=db.backref('prescriptions', lazy=True))
    pharmacy = db.relationship('Pharmacy', backref=db.backref('dispensed_prescriptions', lazy=True))

    def get_medicines(self):
        return self.medicines if self.medicines else []

    def set_medicines(self, medicines_list):
        self.medicines = medicines_list

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "rx_code": self.rx_code,
            "doctor_name": self.doctor_name,
            "facility": self.facility,
            "issue_date": self.issue_date.strftime('%Y-%m-%d') if self.issue_date else None,
            "expiry_date": self.expiry_date.strftime('%Y-%m-%d') if self.expiry_date else None,
            "diagnosis": self.diagnosis,
            "status": self.status,
            "medicines": self.get_medicines(),
            "pharmacy_note": self.pharmacy_note,
            "transaction_id": self.transaction_id,
            "dispensed_at": self.dispensed_at.strftime('%Y-%m-%d %H:%M:%S') if self.dispensed_at else None,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
