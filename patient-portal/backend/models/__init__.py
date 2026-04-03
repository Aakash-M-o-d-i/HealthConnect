from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

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

    def get_allergies(self):
        return self.allergies if self.allergies else []
            
    def set_allergies(self, allergies_list):
        self.allergies = allergies_list

    def get_chronic_conditions(self):
        return self.chronic_conditions if self.chronic_conditions else []
            
    def set_chronic_conditions(self, conditions_list):
        self.chronic_conditions = conditions_list

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
            "allergies": self.get_allergies(),
            "chronic_conditions": self.get_chronic_conditions(),
            "emergency_contact": self.emergency_contact
        }

class MedicalRecord(db.Model):
    __tablename__ = "medical_records"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    date = db.Column(db.Date, nullable=False)
    doctor_name = db.Column(db.String(255), nullable=True)
    facility = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(50), nullable=True)
    title = db.Column(db.String(255), nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    patient = db.relationship('User', backref=db.backref('medical_records', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None,
            "doctor_name": self.doctor_name,
            "facility": self.facility,
            "type": self.type,
            "title": self.title,
            "diagnosis": self.diagnosis,
            "file_url": self.file_url,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
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
    file_url = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=True)
    dispensed_at = db.Column(db.DateTime, nullable=True)
    dispensed_by = db.Column(db.Integer, nullable=True) # Reference to pharmacies table
    
    patient = db.relationship('User', backref=db.backref('prescriptions', lazy=True, cascade="all, delete-orphan"))
    doctor = db.relationship('Doctor', backref=db.backref('prescriptions', lazy=True))

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
            "file_url": self.file_url,
            "dispensed_at": self.dispensed_at.strftime('%Y-%m-%d %H:%M:%S') if self.dispensed_at else None,
            "created_at": self.created_at.strftime('%Y-%m-%d') if self.created_at else None
        }

class Visit(db.Model):
    __tablename__ = "visits"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    doctor_name = db.Column(db.String(255), nullable=True)
    facility = db.Column(db.String(255), nullable=True)
    date = db.Column(db.Date, nullable=True)
    time = db.Column(db.Time, nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)
    visit_type = db.Column(db.String(50), nullable=True, default="Follow-up")
    status = db.Column(db.String(50), nullable=True, default="Waiting")
    blood_pressure = db.Column(db.String(50), nullable=True)
    temperature = db.Column(db.String(50), nullable=True)
    pulse = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(50), nullable=True)
    spo2 = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    patient = db.relationship('User', backref=db.backref('visits', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_name": self.doctor_name,
            "facility": self.facility,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None,
            "time": self.time.strftime('%H:%M:%S') if self.time else None,
            "type": self.visit_type,
            "status": self.status,
            "blood_pressure": self.blood_pressure,
            "temperature": self.temperature,
            "pulse": self.pulse,
            "weight": self.weight,
            "spo2": self.spo2,
            "diagnosis": self.diagnosis,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
