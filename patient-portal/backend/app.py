from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models import db
from src.config import Config
from flask_jwt_extended import JWTManager

# Load environment variables
load_dotenv()

def create_app():
    

    @app.route('/api')
    def api_index():
        return jsonify({"message": "HealthConnect API Root endpoint"})

    # Blueprints registration
    from routes.auth import auth_bp
    from routes.patient import patient_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patient_bp, url_prefix='/api/patient')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
