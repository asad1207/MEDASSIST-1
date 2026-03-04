from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Appointment
from app.schemas.schemas import AppointmentCreate, AppointmentOut, AppointmentUpdate
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/", response_model=List[AppointmentOut])
def list_appointments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.user_id == current_user.id)\
             .order_by(Appointment.appointment_date).all()


@router.post("/", response_model=AppointmentOut, status_code=201)
def create_appointment(payload: AppointmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = Appointment(user_id=current_user.id, **payload.dict())
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt


@router.put("/{appointment_id}", response_model=AppointmentOut)
def update_appointment(appointment_id: str, payload: AppointmentUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(appt, key, value)
    db.commit()
    db.refresh(appt)
    return appt


@router.delete("/{appointment_id}", status_code=204)
def delete_appointment(appointment_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appt)
    db.commit()
