from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('medications', __name__)

MOCK_MEDICATIONS_DB = [
    {
        "id": "med-001",
        "name": "Salbutamol 100mcg",
        "dosage": "2 puffs",
        "frequency": "as_needed",
        "timing": [],
        "start_date": "2026-04-01",
        "end_date": "2026-12-31",
        "instructions": "Use inhaler as needed for breathing difficulty.",
        "status": "active",
        "remaining_days": 212,
        "prescribed_by": "Dr. Arjun Nair",
        "taken_today": True,
        "adherence_percent": 94,
        "missed_doses": 1
    },
    {
        "id": "med-002",
        "name": "Amlodipine 5mg",
        "dosage": "1 tablet",
        "frequency": "once",
        "timing": ["09:00"],
        "start_date": "2026-03-01",
        "end_date": "2026-09-01",
        "instructions": "Take in the morning with water. Do not crush.",
        "status": "active",
        "remaining_days": 6,
        "prescribed_by": "Dr. Arjun Nair",
        "taken_today": False,
        "adherence_percent": 88,
        "missed_doses": 3
    },
    {
        "id": "med-003",
        "name": "Vitamin D3 1000 IU",
        "dosage": "1 capsule",
        "frequency": "once",
        "timing": ["08:00"],
        "start_date": "2026-05-01",
        "end_date": "2026-08-01",
        "instructions": "Take with fatty meal for better absorption.",
        "status": "active",
        "remaining_days": 30,
        "prescribed_by": "Self",
        "taken_today": True,
        "adherence_percent": 100,
        "missed_doses": 0
    },
    {
        "id": "med-004",
        "name": "Azithromycin 500mg",
        "dosage": "1 tablet",
        "frequency": "once",
        "timing": ["08:00"],
        "start_date": "2026-04-10",
        "end_date": "2026-04-15",
        "instructions": "Complete the full course even if you feel better.",
        "status": "completed",
        "remaining_days": 0,
        "prescribed_by": "Dr. Kavya Verma",
        "taken_today": False,
        "adherence_percent": 100,
        "missed_doses": 0
    }
]

@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
@require_auth()
def get_medications():
    """Retrieve all medications for current patient with summary stats"""
    active_meds = [m for m in MOCK_MEDICATIONS_DB if m.get('status') == 'active']
    taken_today = [m for m in active_meds if m.get('taken_today')]
    adherence_today = round((len(taken_today) / len(active_meds) * 100)) if active_meds else 100

    return jsonify({
        "success": True,
        "medications": MOCK_MEDICATIONS_DB,
        "summary": {
            "total": len(MOCK_MEDICATIONS_DB),
            "active": len(active_meds),
            "taken_today": len(taken_today),
            "pending_today": len(active_meds) - len(taken_today),
            "adherence_today_percent": adherence_today
        }
    })

@bp.route('', methods=['POST'])
@bp.route('/', methods=['POST'])
@require_auth(role='patient')
def create_medication():
    """Add a new prescription or over-the-counter medication"""
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    dosage = (data.get('dosage') or '').strip()

    if not name:
        return jsonify({"success": False, "error": "Medication name is required"}), 400
    if not dosage:
        return jsonify({"success": False, "error": "Dosage is required"}), 400

    new_med = {
        "id": f"med-{int(datetime.now().timestamp() * 1000)}",
        "name": name,
        "dosage": dosage,
        "frequency": data.get('frequency', 'once'),
        "timing": data.get('timing', ['09:00']),
        "start_date": data.get('start_date', datetime.now().strftime('%Y-%m-%d')),
        "end_date": data.get('end_date', ''),
        "instructions": data.get('instructions', ''),
        "status": "active",
        "remaining_days": 30,
        "prescribed_by": data.get('prescribed_by', 'Self'),
        "taken_today": False,
        "adherence_percent": 100,
        "missed_doses": 0
    }

    MOCK_MEDICATIONS_DB.insert(0, new_med)

    return jsonify({
        "success": True,
        "message": "Medication added successfully",
        "medication": new_med
    }), 201

@bp.route('/<med_id>', methods=['PUT', 'PATCH'])
@require_auth()
def update_medication(med_id):
    """Update medication details or mark dose taken"""
    data = request.get_json(silent=True) or {}
    for m in MOCK_MEDICATIONS_DB:
        if m['id'] == med_id:
            m.update(data)
            return jsonify({
                "success": True,
                "message": "Medication updated",
                "medication": m
            })
    return jsonify({"success": False, "error": "Medication not found"}), 404

@bp.route('/<med_id>', methods=['DELETE'])
@require_auth()
def delete_medication(med_id):
    """Remove a medication from patient schedule"""
    global MOCK_MEDICATIONS_DB
    before_len = len(MOCK_MEDICATIONS_DB)
    MOCK_MEDICATIONS_DB = [m for m in MOCK_MEDICATIONS_DB if m['id'] != med_id]
    if len(MOCK_MEDICATIONS_DB) < before_len:
        return jsonify({"success": True, "message": "Medication removed"})
    return jsonify({"success": False, "error": "Medication not found"}), 404
