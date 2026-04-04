import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import db, User
from sqlalchemy import or_

app = create_app()

def test():
    with app.app_context():
        q = 'HID-1001'
        # Emulate the logic in doctor.py
        results = User.query.filter(
            or_(
                User.name.ilike(f'%{q}%'),
                User.phone.ilike(f'%{q}%'),
                User.health_id.ilike(f'%{q}%'),
                User.govt_id.ilike(f'%{q}%')
            )
        ).all()
        
        print(f"Results for '{q}': {len(results)}")
        for r in results:
            print(f"  - {r.name}: {r.to_dict()}")

if __name__ == "__main__":
    test()
