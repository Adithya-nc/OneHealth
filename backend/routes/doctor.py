from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('doctor', __name__)

DOCTOR_PATIENTS_DB = [
    {
        "id": "P-9821",
        "name": "Michael Chang",
        "age": 45,
        "gender": "M",
        "bloodGroup": "O+",
        "lastVisit": "2 days ago",
        "healthScore": 78,
        "tags": ["Hypertension"],
        "avatar": "MC",
        "risk": "moderate",
        "vitals": {"bp": "138/88", "pulse": 76, "bmi": 26.2, "spo2": 98},
        "allergies": ["Penicillin"],
        "active_medications": ["Amlodipine 5mg", "Lisinopril 10mg"]
    },
    {
        "id": "P-3422",
        "name": "Sarah Jenkins",
        "age": 32,
        "gender": "F",
        "bloodGroup": "A-",
        "lastVisit": "1 week ago",
        "healthScore": 92,
        "tags": ["Healthy"],
        "avatar": "SJ",
        "risk": "low",
        "vitals": {"bp": "118/76", "pulse": 70, "bmi": 21.8, "spo2": 99},
        "allergies": [],
        "active_medications": ["Multivitamin"]
    },
    {
        "id": "P-1123",
        "name": "David Warner",
        "age": 58,
        "gender": "M",
        "bloodGroup": "B+",
        "lastVisit": "Today",
        "healthScore": 45,
        "tags": ["Diabetes", "Heart Disease"],
        "avatar": "DW",
        "risk": "high",
        "vitals": {"bp": "152/94", "pulse": 84, "bmi": 31.4, "spo2": 96},
        "allergies": ["Sulfa drugs"],
        "active_medications": ["Metformin 1000mg", "Atorvastatin 40mg", "Aspirin 81mg"]
    },
    {
        "id": "P-8834",
        "name": "Emily Davis",
        "age": 28,
        "gender": "F",
        "bloodGroup": "O-",
        "lastVisit": "1 month ago",
        "healthScore": 88,
        "tags": ["Asthma"],
        "avatar": "ED",
        "risk": "low",
        "vitals": {"bp": "116/74", "pulse": 72, "bmi": 22.1, "spo2": 98},
        "allergies": ["Dust mites", "Pollen"],
        "active_medications": ["Salbutamol Inhaler"]
    }
]

CONSULTATION_RECORDS = []

@bp.route('/patients', methods=['GET'])
@require_auth()
def list_patients():
    """Return all assigned doctor patients with summary triage"""
    search_query = request.args.get('search', '').lower()
    risk_filter = request.args.get('risk', '').lower()

    results = DOCTOR_PATIENTS_DB
    if search_query:
        results = [p for p in results if search_query in p['name'].lower() or search_query in p['id'].lower()]
    if risk_filter and risk_filter != 'all':
        results = [p for p in results if p['risk'].lower() == risk_filter]

    return jsonify({
        "success": True,
        "count": len(results),
        "patients": results
    })

@bp.route('/patients/<patient_id>', methods=['GET'])
@require_auth()
def get_patient(patient_id):
    """Retrieve full clinical dossier for a given patient"""
    patient = next((p for p in DOCTOR_PATIENTS_DB if p['id'] == patient_id), None)
    if not patient:
        return jsonify({"success": False, "error": "Patient not found"}), 404

    return jsonify({
        "success": True,
        "patient": patient,
        "consultation_history": [c for c in CONSULTATION_RECORDS if c.get('patient_id') == patient_id]
    })

@bp.route('/consultations', methods=['POST'])
@require_auth()
def save_consultation():
    """Save finalized clinical consultation notes and prescription"""
    data = request.get_json(silent=True) or {}
    patient_id = data.get('patient_id')
    diagnosis = data.get('diagnosis')

    if not patient_id:
        return jsonify({"success": False, "error": "Patient ID is required"}), 400

    consultation = {
        "id": f"cons-{int(datetime.now().timestamp())}",
        "patient_id": patient_id,
        "doctor_name": data.get('doctor_name', 'Dr. Sarah Smith'),
        "timestamp": datetime.now().isoformat(),
        "symptoms": data.get('symptoms', []),
        "diagnosis": diagnosis or "General Follow-up",
        "doctor_notes": data.get('doctor_notes', ''),
        "prescriptions": data.get('prescriptions', []),
        "follow_up_days": data.get('follow_up_days', 7),
        "ai_summary": data.get('ai_summary', {})
    }

    CONSULTATION_RECORDS.insert(0, consultation)

    return jsonify({
        "success": True,
        "message": "Consultation saved successfully",
        "consultation": consultation
    }), 201
