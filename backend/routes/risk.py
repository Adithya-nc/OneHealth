from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime, timedelta

bp = Blueprint('risk', __name__)

# In-memory history for demonstration and user assessments
USER_RISK_HISTORY = [
    { "date": "2025-10-15", "composite_score": 38, "tier": "moderate", "cardio": 42, "metabolic": 36, "pulmonary": 32 },
    { "date": "2025-11-20", "composite_score": 34, "tier": "moderate", "cardio": 38, "metabolic": 32, "pulmonary": 30 },
    { "date": "2025-12-18", "composite_score": 30, "tier": "moderate", "cardio": 32, "metabolic": 30, "pulmonary": 28 },
    { "date": "2026-01-22", "composite_score": 26, "tier": "moderate", "cardio": 28, "metabolic": 26, "pulmonary": 26 },
    { "date": "2026-02-19", "composite_score": 22, "tier": "moderate", "cardio": 24, "metabolic": 22, "pulmonary": 22 },
    { "date": "2026-03-25", "composite_score": 18, "tier": "low", "cardio": 20, "metabolic": 18, "pulmonary": 18 },
]

def calculate_clinical_risk(data):
    """
    Core algorithmic engine calculating multi-factor clinical risk forecasts
    based on vital metrics, lifestyle indices, and health history.
    """
    age = float(data.get('age', 32))
    systolic_bp = float(data.get('systolic_bp', 120))
    diastolic_bp = float(data.get('diastolic_bp', 80))
    bmi = float(data.get('bmi', 21.3))
    fasting_glucose = float(data.get('fasting_glucose', 92))
    cholesterol = float(data.get('cholesterol', 185))
    smoker = bool(data.get('smoker', False))
    exercise_hours = float(data.get('exercise_hours_weekly', 3.5))
    sleep_hours = float(data.get('sleep_hours', 7.5))
    diet_tier = str(data.get('diet_tier', 'balanced')).lower()
    has_asthma = bool(data.get('has_asthma', True))
    family_history_cardio = bool(data.get('family_history_cardio', False))

    # 1. Cardiovascular Risk Score (Framingham risk inspired)
    cv_points = 0
    if age > 45: cv_points += 2
    if age > 55: cv_points += 2
    if systolic_bp >= 140 or diastolic_bp >= 90: cv_points += 3
    elif systolic_bp >= 130 or diastolic_bp >= 85: cv_points += 1
    if cholesterol > 200: cv_points += 2
    if smoker: cv_points += 4
    if family_history_cardio: cv_points += 2
    if exercise_hours < 2.0: cv_points += 2

    # Lifestyle modifications
    exercise_mod = (exercise_hours - 3.5) * -2.5
    sleep_mod = 4 if sleep_hours < 6 else (-3 if 7 <= sleep_hours <= 8.5 else 0)
    diet_mod = -4 if diet_tier == 'clean' else (6 if diet_tier == 'high-sodium' else 0)

    cv_score_pct = max(5, min(85, round(16 + (cv_points * 5) + exercise_mod + sleep_mod + diet_mod)))
    cv_tier = "low" if cv_score_pct < 20 else ("moderate" if cv_score_pct < 45 else "high")

    # 2. Metabolic & Type 2 Diabetes Risk Score (FINDRISC inspired)
    metabolic_points = 0
    if bmi >= 30: metabolic_points += 3
    elif bmi >= 25: metabolic_points += 1
    if fasting_glucose >= 126: metabolic_points += 4
    elif fasting_glucose >= 100: metabolic_points += 2
    if exercise_hours < 2.5: metabolic_points += 2

    metabolic_score_pct = max(4, min(80, round(12 + (metabolic_points * 8) + (diet_mod * 0.8) + (exercise_mod * 0.5))))
    metabolic_tier = "low" if metabolic_score_pct < 22 else ("moderate" if metabolic_score_pct < 45 else "high")

    # 3. Pulmonary & Allergy Response
    resp_base = 24 if has_asthma else 8
    if smoker: resp_base += 32
    if exercise_hours > 4: resp_base -= 4
    resp_score_pct = max(6, min(90, round(resp_base)))
    resp_tier = "moderate" if resp_score_pct >= 20 and resp_score_pct < 50 else ("high" if resp_score_pct >= 50 else "low")

    # 4. Composite 10-Year Health Risk Score
    composite_score = round((cv_score_pct * 0.45) + (metabolic_score_pct * 0.35) + (resp_score_pct * 0.20))
    overall_tier = "low" if composite_score < 20 else ("moderate" if composite_score < 45 else "high")
    overall_health_score = max(50, min(98, 100 - round(composite_score * 0.85)))

    return {
        "success": True,
        "assessment_timestamp": datetime.now().isoformat(),
        "overall_risk_tier": overall_tier,
        "composite_risk_score": composite_score,
        "overall_health_score": overall_health_score,
        "domains": {
            "cardiovascular": {
                "name": "Cardiovascular Health",
                "risk_percentage": cv_score_pct,
                "tier": cv_tier,
                "key_drivers": [
                    f"Blood Pressure baseline: {int(systolic_bp)}/{int(diastolic_bp)} mmHg",
                    "Non-smoking status reduces 10-year arterial plaque risk" if not smoker else "Active tobacco smoking severely compounds vascular risk (+22%)",
                    f"Weekly moderate exercise ({exercise_hours} hrs) safeguards endothelial elasticity"
                ],
                "recommendation": "Maintain aerobic endurance activities 3-4 times weekly."
            },
            "metabolic": {
                "name": "Type 2 Diabetes & Metabolism",
                "risk_percentage": metabolic_score_pct,
                "tier": metabolic_tier,
                "key_drivers": [
                    f"BMI index: {bmi} ({'Healthy' if bmi < 25 else 'Overweight'})",
                    f"Fasting glucose: {int(fasting_glucose)} mg/dL (Target: 70–99 mg/dL)",
                    f"Diet quality profile: {diet_tier.capitalize()}"
                ],
                "recommendation": "Sustain a balanced diet rich in complex fibers and leafy greens."
            },
            "respiratory": {
                "name": "Pulmonary & Allergy Response",
                "risk_percentage": resp_score_pct,
                "tier": resp_tier,
                "key_drivers": [
                    "Mild asthma history documented in Health Passport" if has_asthma else "Clear pulmonary baseline without chronic obstruction",
                    "Dust mite sensitivity flagged in allergy register",
                    "Protected airway clearance" if not smoker else "Active smoke exposure heightens airway hyperreactivity"
                ],
                "recommendation": "Keep prescribed bronchodilator accessible during seasonal air quality fluctuations."
            }
        },
        "lifestyle_impact_simulation": {
            "exercise_boost_benefit": f"-{(max(0, exercise_hours - 2) * 2):.1f}% risk reduction from regular cardiovascular fitness",
            "sodium_reduction_benefit": "-4 mmHg systolic reduction achievable on anti-inflammatory diet",
            "sleep_optimization_benefit": "Restful 7-8h sleep stabilizes nocturnal cortisol and autonomic vascular tone"
        },
        "history": USER_RISK_HISTORY,
        "disclaimer": "AI-assisted guidance only. Not a replacement for professional medical evaluation. Consult your physician before making clinical decisions."
    }

@bp.route('/predict', methods=['POST'])
@require_auth()
def predict_risk():
    """Predict risk based on real-time payload or simulator sliders"""
    data = request.get_json(silent=True) or {}
    result = calculate_clinical_risk(data)
    return jsonify(result)

@bp.route('/assessment', methods=['GET'])
@require_auth()
def get_current_assessment():
    """Retrieve default assessment computed from patient baseline"""
    default_payload = {
        "age": 32,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "bmi": 21.3,
        "fasting_glucose": 92,
        "cholesterol": 185,
        "smoker": False,
        "exercise_hours_weekly": 3.5,
        "sleep_hours": 7.5,
        "diet_tier": "balanced",
        "has_asthma": True,
        "family_history_cardio": False
    }
    result = calculate_clinical_risk(default_payload)
    return jsonify(result)

@bp.route('/history', methods=['GET'])
@require_auth()
def get_risk_history():
    """Retrieve 6-month historical risk progression telemetry"""
    return jsonify({
        "success": True,
        "history": USER_RISK_HISTORY
    })

@bp.route('/save', methods=['POST'])
@require_auth()
def save_risk_assessment():
    """Save newly computed risk snapshot to user timeline"""
    data = request.get_json(silent=True) or {}
    score = data.get('composite_risk_score', 18)
    tier = data.get('overall_risk_tier', 'low')

    snapshot = {
        "date": datetime.now().strftime('%Y-%m-%d'),
        "composite_score": score,
        "tier": tier,
        "cardio": data.get('domains', {}).get('cardiovascular', {}).get('risk_percentage', 20),
        "metabolic": data.get('domains', {}).get('metabolic', {}).get('risk_percentage', 18),
        "pulmonary": data.get('domains', {}).get('respiratory', {}).get('risk_percentage', 18),
    }
    USER_RISK_HISTORY.append(snapshot)
    return jsonify({
        "success": True,
        "message": "Risk assessment saved successfully",
        "snapshot": snapshot
    }), 201
