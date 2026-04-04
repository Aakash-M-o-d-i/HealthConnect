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
    # Serve static files from the React frontend build folder
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    app = Flask(__name__, static_folder=frontend_dist)
    CORS(app)

    app.config.from_object(Config)

    db.init_app(app)
    jwt = JWTManager(app)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api/'):
            return jsonify({"message": "API endpoint not found"}), 404
        
        # Check if the path is a real static file (e.g. assets/main.js)
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
            
        # Otherwise, return index.html for React Router to handle
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/api')
    def api_index():
        return jsonify({"message": "HealthConnect Doctor API Root endpoint"})

    # Blueprints registration
    from routes.auth import auth_bp
    from routes.doctor import doctor_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(doctor_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=True)
