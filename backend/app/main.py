import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, symptoms, history, appointments
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MedAssist API",
    description="AI-powered healthcare assistant backend",
    version="1.0.0"
)

# Read allowed origins from env — comma-separated for multiple URLs
# e.g. "http://localhost:3000,https://medassist.vercel.app"
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/api/users",        tags=["Users"])
app.include_router(symptoms.router,     prefix="/api/symptoms",     tags=["Symptoms"])
app.include_router(history.router,      prefix="/api/history",      tags=["History"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])

@app.get("/")
def root():
    return {"message": "MedAssist API running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
