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
        
        # If frontend build exists, serve static files
        if app.static_folder and os.path.exists(app.static_folder):
            # Check if the path is a real static file (e.g. assets/main.js)
            if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
                return send_from_directory(app.static_folder, path)
            
            # Serve index.html for React Router to handle
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
        
        # Fallback if no frontend build exists yet
        return jsonify({"message": "HealthConnect Pharmacy Portal API is running. Frontend not built yet.", "api": "/api"})

    @app.route('/api')
    def api_index():
        return jsonify({"message": "HealthConnect Pharmacy API Root endpoint"})

    # Blueprints registration
    from routes.auth import auth_bp
    from routes.pharmacy import pharmacy_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pharmacy_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5002, debug=True)
