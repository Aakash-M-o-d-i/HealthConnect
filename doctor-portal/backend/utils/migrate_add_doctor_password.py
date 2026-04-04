"""
Migration script to add password_hash column to the doctors table
and set default passwords for all existing doctors.

Default password for all doctors: doctor@123
"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv
load_dotenv()

from app import create_app
from models import db, Doctor
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Step 1: Add password_hash column if it doesn't exist
    from sqlalchemy import text
    try:
        db.session.execute(text("ALTER TABLE doctors ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL"))
        db.session.commit()
        print("[OK] Added 'password_hash' column to 'doctors' table.")
    except Exception as e:
        db.session.rollback()
        if "Duplicate column" in str(e):
            print("[SKIP] 'password_hash' column already exists.")
        else:
            print(f"[ERROR] {e}")

    # Step 2: Set default password 'doctor@123' for all doctors
    default_password = "doctor@123"
    hashed = generate_password_hash(default_password)

    doctors = Doctor.query.all()
    for doc in doctors:
        doc.password_hash = hashed
        print(f"  → Set password for {doc.name} ({doc.email})")

    db.session.commit()
    print(f"\n[DONE] Default password 'doctor@123' set for {len(doctors)} doctor(s).")
    print("Doctors can now log in with their email and password: doctor@123")
