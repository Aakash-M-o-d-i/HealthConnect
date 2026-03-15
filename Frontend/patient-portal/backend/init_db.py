import os
import re
from datetime import datetime
import json
from app import create_app
from models import db, User, Doctor, MedicalRecord, Prescription, Visit

DUMP_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'database', 'database_dump.sql')

def parse_sql_dump(filepath):
    """Parses a basic MySQL dump to extract INSERT INTO statements."""
    if not os.path.exists(filepath):
        print(f"Error: Could not find dump file at {filepath}")
        return {}

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all INSERT INTO statements
    insert_pattern = re.compile(r"INSERT INTO `(\w+)` VALUES (.*?);", re.IGNORECASE | re.DOTALL)
    matches = insert_pattern.findall(content)

    tables_data = {}
    for table_name, values_str in matches:
        # Regex to split multiple tuples: (val1, val2), (val3, val4) ...
        # This basic regex handles most simple cases but may fail if strings contain '), (' 
        # For the provided dump, it should be sufficient.
        
        # Split by '),(' and clean up edges
        values_str = values_str.strip()
        if values_str.startswith('('):
            values_str = values_str[1:]
        if values_str.endswith(')'):
            values_str = values_str[:-1]
            
        # Split into individual rows
        rows = values_str.split('),(')
        
        parsed_rows = []
        for row in rows:
            # We need to carefully split by comma, respecting quotes
            # A simpler approach using eval since the dump structure is known and safe
            # Replace NULL with None
            row_safe = row.replace('NULL', 'None')
            # Evaluate the python tuple
            try:
                 parsed_tuple = eval(f"({row_safe},)")
                 # eval adds an extra tuple level if we add comma, let's just make it a list
                 parsed_rows.append(parsed_tuple)
            except Exception as e:
                print(f"Warn: Failed to parse row in {table_name}: {row}")
                print(e)
                
        tables_data[table_name] = parsed_rows
        
    return tables_data

def populate_db():
    app = create_app()
    with app.app_context():
        # Ensure fresh database
        db.drop_all()
        db.create_all()
        print("Created clean SQLite database tables.")

        data = parse_sql_dump(DUMP_FILE)
        
        if not data:
            print("No data parsed from dump. Starting with empty database.")
            return

        print(f"Parsed tables: {list(data.keys())}")

        # Insert Doctors
        if 'doctors' in data:
            doctors_to_add = []
            for row in data['doctors']:
                # `id`, `name`, `specialization`, `email`
                d = Doctor(
                    id=row[0],
                    name=row[1],
                    specialization=row[2],
                    email=row[3]
                )
                doctors_to_add.append(d)
                
            db.session.add_all(doctors_to_add)
            db.session.commit()
            print(f"Inserted {len(doctors_to_add)} doctors.")

        # Insert Users
        if 'users' in data:
            users_to_add = []
            for row in data['users']:
                # id, name, email, password_hash, phone, dob, gender, blood_group, govt_id, health_id, address, city, state, pincode, emergency_contact, allergies, chronic_conditions, created_at
                created_at_dt = datetime.strptime(row[17], '%Y-%m-%d %H:%M:%S') if row[17] else datetime.utcnow()
                
                u = User(
                    id=row[0],
                    name=row[1],
                    email=row[2],
                    password_hash=row[3],
                    phone=row[4],
                    dob=datetime.strptime(row[5], '%Y-%m-%d').date() if row[5] else None,
                    gender=row[6],
                    blood_group=row[7],
                    govt_id=row[8],
                    health_id=row[9],
                    address=row[10],
                    city=row[11],
                    state=row[12],
                    pincode=row[13],
                    emergency_contact=row[14],
                    allergies=json.loads(row[15]) if row[15] else None,
                    chronic_conditions=json.loads(row[16]) if row[16] else None,
                    created_at=created_at_dt
                )
                users_to_add.append(u)
                
            db.session.add_all(users_to_add)
            db.session.commit()
            print(f"Inserted {len(users_to_add)} users.")

        # Insert Medical Records
        if 'medical_records' in data:
            records_to_add = []
            for row in data['medical_records']:
                # id, patient_id, date, doctor_name, facility, type, title, diagnosis, file_url, created_at
                created_at_dt = datetime.strptime(row[9], '%Y-%m-%d %H:%M:%S') if row[9] else datetime.utcnow()
                
                mr = MedicalRecord(
                    id=row[0],
                    patient_id=row[1],
                    date=datetime.strptime(row[2], '%Y-%m-%d').date(),
                    doctor_name=row[3],
                    facility=row[4],
                    type=row[5],
                    title=row[6],
                    diagnosis=row[7],
                    file_url=row[8],
                    created_at=created_at_dt
                )
                records_to_add.append(mr)
                
            db.session.add_all(records_to_add)
            db.session.commit()
            print(f"Inserted {len(records_to_add)} medical records.")

        # Insert Prescriptions
        if 'prescriptions' in data:
            rx_to_add = []
            for row in data['prescriptions']:
                # id, patient_id, rx_code, doctor_name, facility, issue_date, expiry_date, diagnosis, status, medicines, pharmacy_note, transaction_id, created_at, doctor_id
                created_at_dt = datetime.strptime(row[12], '%Y-%m-%d %H:%M:%S') if row[12] else datetime.utcnow()
                
                rx = Prescription(
                    id=row[0],
                    patient_id=row[1],
                    rx_code=row[2],
                    doctor_name=row[3],
                    facility=row[4],
                    issue_date=datetime.strptime(row[5], '%Y-%m-%d').date() if row[5] else None,
                    expiry_date=datetime.strptime(row[6], '%Y-%m-%d').date() if row[6] else None,
                    diagnosis=row[7],
                    status=row[8],
                    medicines=json.loads(row[9]) if row[9] else None,
                    pharmacy_note=row[10],
                    transaction_id=row[11],
                    created_at=created_at_dt,
                    doctor_id=row[13] if len(row) > 13 else None
                )
                rx_to_add.append(rx)
                
            db.session.add_all(rx_to_add)
            db.session.commit()
            print(f"Inserted {len(rx_to_add)} prescriptions.")

        # Insert Visits
        if 'visits' in data:
            visits_to_add = []
            for row in data['visits']:
                # id, patient_id, doctor_name, facility, date, time, diagnosis, created_at
                created_at_dt = datetime.strptime(row[7], '%Y-%m-%d %H:%M:%S') if row[7] else datetime.utcnow()
                
                v = Visit(
                    id=row[0],
                    patient_id=row[1],
                    doctor_name=row[2],
                    facility=row[3],
                    date=datetime.strptime(row[4], '%Y-%m-%d').date() if row[4] else None,
                    time=datetime.strptime(row[5], '%H:%M:%S').time() if row[5] else None,
                    diagnosis=row[6],
                    created_at=created_at_dt
                )
                visits_to_add.append(v)
                
            db.session.add_all(visits_to_add)
            db.session.commit()
            print(f"Inserted {len(visits_to_add)} visits.")

        print("Successfully populated SQLite database with sample data.")


if __name__ == '__main__':
    populate_db()
