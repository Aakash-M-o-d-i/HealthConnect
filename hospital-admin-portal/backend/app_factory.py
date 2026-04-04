import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from utils.responses import error_response

load_dotenv()

def create_app(config=None):
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Initialize Extensions
    from models import db
    db.init_app(app)

    # Register Blueprints (Routes)
    from routes.admin import admin_bp
    from routes.doctors import doctors_bp
    from routes.pharmacies import pharmacies_bp
    from routes.staff import staff_bp
    
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
    app.register_blueprint(pharmacies_bp, url_prefix='/api/pharmacies')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')

    # Create tables
    with app.app_context():
        db.create_all()

    @app.errorhandler(404)
    def not_found(e):
        return error_response("Resource not found", status_code=404)

    @app.errorhandler(500)
    def server_error(e):
        return error_response("Internal server error", status_code=500)

    return app
