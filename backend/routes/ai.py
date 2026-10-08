from flask import Blueprint, jsonify, request
from middleware.auth import require_auth
from flask import current_app

bp = Blueprint('ai', __name__)

@bp.route('/analyze-symptoms', methods=['POST'])
@require_auth(role='patient')
def analyze_symptoms():
    data = request.get_json(silent=True) or {}
    symptoms = [s.strip().lower() for s in data.get('symptoms', []) if s]
    duration = data.get('duration', '1-3days')
    severity_level = data.get('severity', 'moderate')
    include_context = data.get('include_context', True)

    joined_symptoms = " ".join(symptoms)

    # 1. Check for Emergency Red Flags
    emergency_flags = ['chest pain', 'shortness of breath', 'difficulty breathing', 'severe breathing', 'unresponsive', 'stroke', 'paralysis']
    has_emergency = any(flag in joined_symptoms for flag in emergency_flags)

    if has_emergency:
        return jsonify({
            "severity": "critical",
            "urgency": "Emergency Medical Evaluation Required",
            "severity_explanation": "One or more reported symptoms (such as chest pain or breathing difficulty) represent potential red-flag acute indicators requiring immediate in-person medical evaluation.",
            "possible_conditions": [
                {
                    "name": "Acute Cardiorespiratory Distress / Bronchospasm",
                    "explanation": "Sudden difficulty breathing or chest constriction warrants urgent medical diagnostics to rule out acute ischemia or severe asthma exacerbation.",
                    "confidence": "high"
                },
                {
                    "name": "Acute Lower Respiratory Infection",
                    "explanation": "Severe inflammation of the bronchial pathways with secondary respiratory distress.",
                    "confidence": "moderate"
                }
            ],
            "recommendations": [
                "Call 112 or local emergency dispatch immediately.",
                "Sit upright in a well-ventilated space and loosen restrictive garments.",
                "If prescribed a rescue bronchodilator (e.g., Salbutamol), administer 2 puffs immediately.",
                "Do not drive yourself to the hospital; await emergency medical transport."
            ],
            "otc_suggestions": [],
            "warning_signs": [
                "Bluish lips or face (Cyanosis)",
                "Inability to speak in full sentences",
                "Crushing pressure radiating to the jaw, neck, or left arm",
                "Sudden dizziness or loss of consciousness"
            ],
            "seek_emergency": True,
            "disclaimer": "AI-assisted clinical triage only. Not a medical diagnosis. Contact emergency emergency services immediately."
        })

    # 2. Digestive symptoms
    if any(k in joined_symptoms for k in ['nausea', 'vomiting', 'diarrhea', 'abdominal', 'stomach', 'bloating']):
        return jsonify({
            "severity": "medium",
            "urgency": "Moderate — Self-Care with Monitoring",
            "severity_explanation": "Symptom cluster is consistent with acute gastroenteritis, dietary irritation, or functional dyspepsia. Rehydration and digestive rest are principal priorities.",
            "possible_conditions": [
                {
                    "name": "Acute Viral Gastroenteritis (Stomach Flu)",
                    "explanation": "Mild inflammation of the stomach and intestinal lining commonly self-limiting within 48–72 hours.",
                    "confidence": "high"
                },
                {
                    "name": "Food Intolerance / Mild Foodborne Infection",
                    "explanation": "Transient microbial or toxic reaction to ingested meals, resolving with fluid replenishment.",
                    "confidence": "moderate"
                },
                {
                    "name": "Acid Reflux / Functional Dyspepsia",
                    "explanation": "Upper gastrointestinal irritation exacerbated by spicy food, stress, or caffeine.",
                    "confidence": "low"
                }
            ],
            "recommendations": [
                "Drink oral rehydration solution (ORS) or electrolyte water in frequent small sips.",
                "Follow a bland BRAT diet (Bananas, Rice, Applesauce, Toast) for the next 24 hours.",
                "Avoid dairy, caffeine, oily foods, and NSAID analgesics which may irritate stomach lining.",
                "Rest and monitor temperature twice daily."
            ],
            "otc_suggestions": [
                { "medicine": "Oral Rehydration Salts (ORS)", "dosage_note": "1 sachet in 1 liter clean water, sip throughout the day" },
                { "medicine": "Antacid / Dimenhydrinate", "dosage_note": "As directed on packaging if nausea is persistent" },
                { "medicine": "Probiotic supplement", "dosage_note": "1 capsule daily to assist gut microbiota recovery" }
            ],
            "warning_signs": [
                "Inability to keep liquids down for more than 12 hours",
                "High fever above 102°F (38.9°C)",
                "Severe localized lower right abdominal pain (Appendicitis risk)",
                "Signs of acute dehydration (dark urine, severe dry mouth, dizziness upon standing)"
            ],
            "seek_emergency": False,
            "disclaimer": "AI-assisted guidance only. Not a substitute for clinical diagnosis. Consult a licensed physician if symptoms persist beyond 48 hours."
        })

    # 3. Default: Upper Respiratory / Viral / General Malaise
    return jsonify({
        "severity": "medium" if severity_level == 'moderate' else ("low" if severity_level == 'mild' else "high"),
        "urgency": "Routine Care — General Practice Follow-Up",
        "severity_explanation": f"Reported symptoms ({', '.join(symptoms[:3]) if symptoms else 'General malaise'}) over {duration} indicate an upper respiratory viral syndrome or benign viral pharyngitis.",
        "possible_conditions": [
            {
                "name": "Viral Upper Respiratory Infection (Common Cold)",
                "explanation": "Self-limiting viral involvement of the nasopharyngeal mucosa with immune-mediated congestion and fever.",
                "confidence": "high"
            },
            {
                "name": "Seasonal Influenza / Viral Syndrome",
                "explanation": "Systemic viral manifestation presenting with myalgia, headache, and thermal instability.",
                "confidence": "moderate"
            },
            {
                "name": "Allergic Rhinosinusitis",
                "explanation": "Environmental allergen hypersensitivity with mucosal irritation and secondary pressure.",
                "confidence": "moderate" if 'cough' in joined_symptoms or 'sneez' in joined_symptoms else "low"
            }
        ],
        "recommendations": [
            "Ensure 8 to 9 hours of restorative sleep to support natural cell-mediated immunity.",
            "Maintain fluid intake at 2.5–3 liters per day (warm broths, water, herbal teas).",
            "Perform warm saline gargles 3 times daily for soothing pharyngeal discomfort.",
            "Use steam inhalation with a drop of eucalyptus oil to clear upper airway passages."
        ],
        "otc_suggestions": [
            { "medicine": "Paracetamol 500mg", "dosage_note": "1 tablet every 6–8 hours as needed for thermal relief or headache" },
            { "medicine": "Saline Nasal Mist", "dosage_note": "2 sprays per nostril 3 times daily to lubricate mucosa" },
            { "medicine": "Cetirizine 10mg", "dosage_note": "1 tablet at bedtime if nighttime nasal congestion impairs sleep" }
        ],
        "warning_signs": [
            "Temperature exceeding 103°F (39.4°C) unresponsive to antipyretics",
            "Development of productive cough with rust-colored or bloody sputum",
            "Severe unilateral ear pain or stiff neck accompanied by light sensitivity",
            "Symptoms progressively worsening after 5 consecutive days"
        ],
        "seek_emergency": False,
        "disclaimer": "AI-assisted clinical triage only. Not a medical diagnosis or prescription. Always consult a qualified medical professional for health concerns."
    })
