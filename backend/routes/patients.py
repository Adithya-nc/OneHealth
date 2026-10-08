from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('patients', __name__)

@bp.route('/profile', methods=['GET'])
@require_auth(role='patient')
def get_profile():
    # In MOCK_MODE or a real setup, return a profile structure matching the frontend
    mock_profile = {
        "uid": g.user_id,
        "name": "Priya Sharma",
        "email": "priya@example.com",
        "phone": "+91 98765 43210",
        "dob": "1994-08-15",
        "gender": "female",
        "blood_group": "O+",
        "height_cm": 165,
        "weight_kg": 58,
        "allergies": ["Penicillin", "Dust Mites"],
        "chronic_diseases": ["Mild Asthma"],
        "emergency_contacts": [
            { "name": "Rahul Sharma", "relationship": "Spouse", "phone": "+91 99887 76655" }
        ]
    }
    
    mock_metrics = {
        "health_score": 88,
        "bmi": 21.3,
        "blood_pressure": "120/80",
        "heart_rate": 72
    }
    
    return jsonify({"profile": mock_profile, "metrics": mock_metrics})

@bp.route('/timeline', methods=['GET'])
@require_auth()
def get_timeline():
    # Mock timeline data for the Passport view
    return jsonify({
        "entries": [
            {
                "id": "rec-1",
                "type": "report",
                "title": "Complete Blood Count",
                "date": datetime.now().isoformat(),
                "metadata": { "hospital": "City Hospital", "doctor_name": "Dr. Sharma" },
                "ai_analysis": {
                    "summary": "All parameters within normal range. Mild elevation in eosinophils.",
                    "status": "normal"
                }
            }
        ]
    })
