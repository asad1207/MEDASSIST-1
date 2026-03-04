from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum


def gen_uuid():
    return str(uuid.uuid4())


class RiskLevel(str, enum.Enum):
    mild = "mild"
    moderate = "moderate"
    emergency = "emergency"


class AppointmentStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=gen_uuid)
    email         = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name     = Column(String, nullable=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    profile       = relationship("HealthProfile", back_populates="user", uselist=False)
    symptom_checks = relationship("SymptomCheck", back_populates="user")
    appointments  = relationship("Appointment", back_populates="user")


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id              = Column(String, primary_key=True, default=gen_uuid)
    user_id         = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    age             = Column(Integer)
    gender          = Column(String)
    blood_group     = Column(String)
    height_cm       = Column(Float)
    weight_kg       = Column(Float)
    medical_conditions = Column(Text)       # comma-separated or JSON string
    allergies       = Column(Text)
    current_medications = Column(Text)
    emergency_contact_name  = Column(String)
    emergency_contact_phone = Column(String)
    smoking         = Column(Boolean, default=False)
    alcohol         = Column(Boolean, default=False)
    exercise_frequency = Column(String)     # none / light / moderate / heavy
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")


class SymptomCheck(Base):
    __tablename__ = "symptom_checks"

    id             = Column(String, primary_key=True, default=gen_uuid)
    user_id        = Column(String, ForeignKey("users.id"), nullable=False)
    symptoms       = Column(Text, nullable=False)   # JSON array string
    severity       = Column(Integer, nullable=False) # 1-10
    duration_days  = Column(Integer)
    risk_level     = Column(Enum(RiskLevel), nullable=False)
    risk_score     = Column(Float)                  # 0.0 – 1.0 from ML model
    ai_recommendation = Column(Text)
    ai_reviewed    = Column(Boolean, default=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="symptom_checks")


class Appointment(Base):
    __tablename__ = "appointments"

    id             = Column(String, primary_key=True, default=gen_uuid)
    user_id        = Column(String, ForeignKey("users.id"), nullable=False)
    doctor_name    = Column(String)
    specialty      = Column(String)
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    notes          = Column(Text)
    status         = Column(Enum(AppointmentStatus), default=AppointmentStatus.scheduled)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="appointments")
