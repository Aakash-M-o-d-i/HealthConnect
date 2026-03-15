from app import create_app
from models import db, User, Doctor, MedicalRecord, Prescription, Visit
from datetime import datetime

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Doctors
    d1 = Doctor(id=2, name='Dr. Rao', specialization='Dermatologist', email='rao@hospital.com')
    d2 = Doctor(id=3, name='Dr. Sharma', specialization='Neurologist', email='sharma@hospital.com')
    d3 = Doctor(id=7, name='Dr. Kumar', specialization='Orthopedic', email='kumar@hospital.com')
    d4 = Doctor(id=1, name='Dr. Mehta', specialization='General', email='mehta@hospital.com')
    db.session.add_all([d1, d2, d3, d4])
    
    # Users
    u1 = User(id=1, name='Rahul Sharma', email='rahul@gmail.com', password_hash='hash123', phone='9876543210', blood_group='O+', health_id='HID-1001', city='Delhi', state='Delhi')
    u2 = User(id=2, name='Anita Verma', email='anita@gmail.com', password_hash='hash456', phone='9876543211', blood_group='A+', health_id='HID-1002', city='Mumbai', state='Maharashtra')
    u3 = User(id=3, name='Vikram Singh', email='vikram@gmail.com', password_hash='hash789', phone='9876543212', blood_group='B+', health_id='HID-1003', city='Bangalore', state='Karnataka')
    db.session.add_all([u1, u2, u3])
    
    # Medical Records
    m1 = MedicalRecord(id=1, patient_id=1, date=datetime.strptime('2026-03-10', '%Y-%m-%d').date(), doctor_name='Dr. Mehta', facility='Apollo Hospital', type='LAB', title='Blood Test', diagnosis='High Cholesterol')
    m2 = MedicalRecord(id=2, patient_id=2, date=datetime.strptime('2026-03-11', '%Y-%m-%d').date(), doctor_name='Dr. Rao', facility='City Hospital', type='SCAN', title='Skin Scan', diagnosis='Dermatitis')
    m3 = MedicalRecord(id=3, patient_id=3, date=datetime.strptime('2026-03-12', '%Y-%m-%d').date(), doctor_name='Dr. Sharma', facility='AIIMS', type='LAB', title='MRI Scan', diagnosis='Brain Scan')
    db.session.add_all([m1, m2, m3])
    
    # Prescriptions
    p1 = Prescription(id=2, patient_id=1, rx_code='RX1001', doctor_name='Dr. Rao', issue_date=datetime.strptime('2026-03-15', '%Y-%m-%d').date(), status='pending', medicines=[{"name": "Paracetamol", "dosage": "500mg"}], doctor_id=2)
    db.session.add(p1)

    # Visits
    v1 = Visit(id=1, patient_id=1, doctor_name='Dr. Mehta', facility='Apollo Hospital', date=datetime.strptime('2026-03-15', '%Y-%m-%d').date(), time=datetime.strptime('10:30:00', '%H:%M:%S').time(), diagnosis='Chest Pain')
    v2 = Visit(id=2, patient_id=2, doctor_name='Dr. Rao', facility='City Hospital', date=datetime.strptime('2026-03-16', '%Y-%m-%d').date(), time=datetime.strptime('11:00:00', '%H:%M:%S').time(), diagnosis='Skin Allergy')
    v3 = Visit(id=3, patient_id=3, doctor_name='Dr. Sharma', facility='AIIMS', date=datetime.strptime('2026-03-17', '%Y-%m-%d').date(), time=datetime.strptime('09:45:00', '%H:%M:%S').time(), diagnosis='Migraine')
    db.session.add_all([v1, v2, v3])

    db.session.commit()
    print("Database seeded successfully with dump data!")
