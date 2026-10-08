from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

import os
import sys

# Force UTF-8 encoding for Windows terminal emoji support
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# pyrefly: ignore [missing-import]
import firebase_admin
# pyrefly: ignore [missing-import]
from firebase_admin import credentials

# Import Blueprints
from routes.patients import bp as patients_bp
from routes.records import bp as records_bp
from routes.ai import bp as ai_bp
from routes.medications import bp as medications_bp
from routes.doctor import bp as doctor_bp
from routes.risk import bp as risk_bp
from routes.notifications import bp as notifications_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    print("=" * 60)
    print("🚀 OneHealth Backend Starting...")
    print(f"📌 MOCK_MODE: {app.config.get('MOCK_MODE', True)}")
    print("=" * 60)

    # Initialize Firebase
    if not app.config.get('MOCK_MODE', True):
        try:
            cred_path = app.config.get(
                'FIREBASE_CREDENTIALS_PATH',
                'firebase-service-account.json'
            )

            if os.path.exists(cred_path):

                # Prevent duplicate initialization
                if not firebase_admin._apps:
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)

                print("✅ Firebase Admin SDK initialized successfully.")

            else:
                print(
                    f"⚠️ Firebase credentials not found: {cred_path}"
                )
                print("⚠️ Switching to MOCK_MODE.")
                app.config['MOCK_MODE'] = True

        except ImportError:
            print("⚠️ firebase-admin package not installed.")
            print("⚠️ Switching to MOCK_MODE.")
            app.config['MOCK_MODE'] = True

        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            print("⚠️ Switching to MOCK_MODE.")
            app.config['MOCK_MODE'] = True

    else:
        print("🧪 Running in MOCK_MODE (No Firebase connection).")

    # Register API Routes
    app.register_blueprint(
        patients_bp,
        url_prefix='/api/patients'
    )

    app.register_blueprint(
        records_bp,
        url_prefix='/api/records'
    )

    app.register_blueprint(
        ai_bp,
        url_prefix='/api/ai'
    )

    app.register_blueprint(
        medications_bp,
        url_prefix='/api/medications'
    )

    app.register_blueprint(
        doctor_bp,
        url_prefix='/api/doctor'
    )

    app.register_blueprint(
        risk_bp,
        url_prefix='/api/risk'
    )

    app.register_blueprint(
        notifications_bp,
        url_prefix='/api/notifications'
    )

    # Health Check Endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "OneHealth Backend",
            "mock_mode": app.config['MOCK_MODE'],
            "firebase_initialized": len(firebase_admin._apps) > 0
        })

    # Root Route
    @app.route('/')
    def home():
        return jsonify({
            "message": "Welcome to OneHealth API",
            "version": "1.0.0",
            "status": "running"
        })

    # Global Error Handler
    @app.errorhandler(Exception)
    def handle_exception(error):
        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    return app


app = create_app()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )