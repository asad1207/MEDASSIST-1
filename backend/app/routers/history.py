from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, SymptomCheck
from app.schemas.schemas import SymptomCheckOut
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/", response_model=List[SymptomCheckOut])
def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    checks = (
        db.query(SymptomCheck)
        .filter(SymptomCheck.user_id == current_user.id)
        .order_by(SymptomCheck.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return checks


@router.get("/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from sqlalchemy import func
    checks = db.query(SymptomCheck).filter(SymptomCheck.user_id == current_user.id)
    total = checks.count()
    by_risk = {
        "mild":      checks.filter(SymptomCheck.risk_level == "mild").count(),
        "moderate":  checks.filter(SymptomCheck.risk_level == "moderate").count(),
        "emergency": checks.filter(SymptomCheck.risk_level == "emergency").count(),
    }
    avg_severity = db.query(func.avg(SymptomCheck.severity)).filter(
        SymptomCheck.user_id == current_user.id
    ).scalar()

    return {
        "total_checks": total,
        "by_risk_level": by_risk,
        "average_severity": round(float(avg_severity or 0), 1),
    }
