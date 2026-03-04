import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, SymptomCheck
from app.schemas.schemas import SymptomCheckCreate, SymptomCheckOut
from app.services.auth_service import get_current_user
from app.services.symptom_service import analyze_symptoms

router = APIRouter()


@router.post("/analyze", response_model=SymptomCheckOut)
def analyze(payload: SymptomCheckCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = analyze_symptoms(payload.symptoms, payload.severity, payload.duration_days or 1)

    check = SymptomCheck(
        user_id=current_user.id,
        symptoms=json.dumps(payload.symptoms),
        severity=payload.severity,
        duration_days=payload.duration_days,
        risk_level=result["risk_level"],
        risk_score=result["risk_score"],
        ai_recommendation=result["ai_recommendation"],
    )
    db.add(check)
    db.commit()
    db.refresh(check)
    return check
