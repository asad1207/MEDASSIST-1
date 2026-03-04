from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.models import RiskLevel, AppointmentStatus


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None


# ─── User ────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Health Profile ───────────────────────────────────────────────────────────

class HealthProfileCreate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    current_medications: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    smoking: Optional[bool] = False
    alcohol: Optional[bool] = False
    exercise_frequency: Optional[str] = None

class HealthProfileOut(HealthProfileCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Symptoms ────────────────────────────────────────────────────────────────

class SymptomCheckCreate(BaseModel):
    symptoms: List[str]
    severity: int          # 1-10
    duration_days: Optional[int] = None

class SymptomCheckOut(BaseModel):
    id: str
    user_id: str
    symptoms: str
    severity: int
    duration_days: Optional[int]
    risk_level: RiskLevel
    risk_score: float
    ai_recommendation: str
    ai_reviewed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Appointments ─────────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    doctor_name: Optional[str] = None
    specialty: Optional[str] = None
    appointment_date: datetime
    notes: Optional[str] = None

class AppointmentOut(AppointmentCreate):
    id: str
    user_id: str
    status: AppointmentStatus
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None
