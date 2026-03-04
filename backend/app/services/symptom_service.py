"""
Symptom Analysis Service
Uses a trained RandomForest model when available,
falls back to a robust rule-based engine.
"""
import json
import os
from typing import List, Tuple

# ─── Symptom Knowledge Base ───────────────────────────────────────────────────

EMERGENCY_SYMPTOMS = {
    "chest pain", "difficulty breathing", "shortness of breath",
    "loss of consciousness", "severe bleeding", "stroke symptoms",
    "sudden severe headache", "paralysis", "seizure", "heart attack",
    "severe allergic reaction", "anaphylaxis", "coughing blood",
    "severe abdominal pain", "high fever above 40"
}

MODERATE_SYMPTOMS = {
    "fever", "vomiting", "diarrhea", "persistent cough", "dizziness",
    "severe headache", "joint pain", "rash", "swelling", "fatigue",
    "nausea", "blurred vision", "ear pain", "sore throat", "back pain",
    "urinary pain", "muscle weakness", "palpitations"
}

MILD_SYMPTOMS = {
    "runny nose", "sneezing", "mild headache", "mild cough",
    "minor fatigue", "dry throat", "minor ache", "bloating",
    "mild nausea", "skin irritation", "minor rash"
}

RECOMMENDATIONS = {
    "emergency": (
        "⚠️ EMERGENCY: Your symptoms indicate a potentially life-threatening condition. "
        "Call emergency services (112/911) immediately or go to the nearest emergency room. "
        "Do NOT wait or drive yourself."
    ),
    "moderate": (
        "🟡 MODERATE: Your symptoms require medical attention. "
        "Please schedule a doctor's appointment within 24–48 hours. "
        "Monitor symptoms closely; if they worsen, seek emergency care."
    ),
    "mild": (
        "🟢 MILD: Your symptoms appear manageable. "
        "Rest, stay hydrated, and monitor your condition. "
        "If symptoms persist beyond 3–5 days or worsen, consult a doctor."
    ),
}


def _normalize(symptom: str) -> str:
    return symptom.lower().strip()


def _rule_based_analysis(symptoms: List[str], severity: int) -> Tuple[str, float, str]:
    """
    Returns (risk_level, risk_score, recommendation)
    risk_score: 0.0 – 1.0
    """
    normalized = [_normalize(s) for s in symptoms]

    # Check for emergency symptoms
    emergency_matches = sum(1 for s in normalized if any(e in s for e in EMERGENCY_SYMPTOMS))
    moderate_matches  = sum(1 for s in normalized if any(m in s for m in MODERATE_SYMPTOMS))

    # Severity heavily influences score
    severity_weight = severity / 10.0

    if emergency_matches > 0 or severity >= 9:
        score = min(0.75 + (0.05 * emergency_matches) + (0.1 * severity_weight), 1.0)
        return "emergency", round(score, 2), RECOMMENDATIONS["emergency"]

    if moderate_matches >= 2 or severity >= 6:
        score = min(0.45 + (0.05 * moderate_matches) + (0.05 * severity_weight), 0.74)
        return "moderate", round(score, 2), RECOMMENDATIONS["moderate"]

    score = max(0.05, min(0.1 * severity_weight + 0.05 * len(normalized), 0.44))
    return "mild", round(score, 2), RECOMMENDATIONS["mild"]


def analyze_symptoms(symptoms: List[str], severity: int, duration_days: int = 1) -> dict:
    """
    Main entry point. Tries ML model first, falls back to rule-based.
    Returns dict with risk_level, risk_score, ai_recommendation.
    """
    model_path = os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")

    if os.path.exists(model_path):
        try:
            import pickle
            import numpy as np
            with open(model_path, "rb") as f:
                model_data = pickle.load(f)
            model     = model_data["model"]
            vectorizer = model_data["vectorizer"]
            le        = model_data["label_encoder"]

            text = " ".join(symptoms)
            X    = vectorizer.transform([text])
            X_full = np.hstack([X.toarray(), [[severity, duration_days or 1]]])
            pred  = model.predict(X_full)[0]
            proba = model.predict_proba(X_full)[0]
            risk_level = le.inverse_transform([pred])[0]
            risk_score = float(max(proba))
            return {
                "risk_level": risk_level,
                "risk_score": round(risk_score, 2),
                "ai_recommendation": RECOMMENDATIONS[risk_level],
            }
        except Exception:
            pass  # fall through to rule-based

    risk_level, risk_score, recommendation = _rule_based_analysis(symptoms, severity)
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "ai_recommendation": recommendation,
    }
