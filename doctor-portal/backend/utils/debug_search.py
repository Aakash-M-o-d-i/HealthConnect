import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import db, User
from sqlalchemy import or_

app = create_app()

def check_db():
    with app.app_context():
        users = User.query.all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"Name: {u.name}, Phone: {u.phone}, Health ID: {u.health_id}, Govt ID: {u.govt_id}")

def test_search(query):
    with app.app_context():
        results = User.query.filter(
            or_(
                User.name.ilike(f'%{query}%'),
                User.phone.ilike(f'%{query}%'),
                User.health_id.ilike(f'%{query}%'),
                User.govt_id.ilike(f'%{query}%')
            )
        ).all()
        print(f"\nSearch results for '{query}': {len(results)}")
        for r in results:
            print(f"  - {r.name} ({r.health_id})")

if __name__ == "__main__":
    check_db()
    if len(sys.argv) > 1:
        test_search(sys.argv[1])
