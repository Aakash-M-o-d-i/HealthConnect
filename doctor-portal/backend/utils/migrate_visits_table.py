import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv
load_dotenv()

from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Add visit_type column
    try:
        db.session.execute(text("ALTER TABLE visits ADD COLUMN visit_type VARCHAR(50) DEFAULT 'Follow-up'"))
        db.session.commit()
        print("[OK] Added 'visit_type' column to 'visits' table.")
    except Exception as e:
        db.session.rollback()
        if "Duplicate column" in str(e) or "1060" in str(e): # 1060 is MySQL error for duplicate column
            print("[SKIP] 'visit_type' column already exists.")
        else:
            print(f"[ERROR adding visit_type] {e}")

    # Add status column
    try:
        db.session.execute(text("ALTER TABLE visits ADD COLUMN status VARCHAR(50) DEFAULT 'Waiting'"))
        db.session.commit()
        print("[OK] Added 'status' column to 'visits' table.")
    except Exception as e:
        db.session.rollback()
        if "Duplicate column" in str(e) or "1060" in str(e):
            print("[SKIP] 'status' column already exists.")
        else:
            print(f"[ERROR adding status] {e}")

    print("\n[DONE] Database migration completed.")
