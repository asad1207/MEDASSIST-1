# MedAssist — AI Healthcare Assistant

> AI-powered symptom triage, health profiling, and appointment management.

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Frontend | Next.js 14, TypeScript        |
| Backend  | FastAPI (Python)               |
| Database | Supabase (PostgreSQL)          |
| Auth     | JWT (python-jose + bcrypt)     |
| ML Model | scikit-learn (RandomForest)    |

---

## Project Structure

```
medassist/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + router setup
│   │   ├── config.py            # Pydantic settings from .env
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/models.py     # User, HealthProfile, SymptomCheck, Appointment
│   │   ├── schemas/schemas.py   # Pydantic request/response schemas
│   │   ├── routers/             # auth, users, symptoms, history, appointments
│   │   ├── services/
│   │   │   ├── auth_service.py  # JWT + bcrypt helpers
│   │   │   └── symptom_service.py # ML + rule-based symptom analysis
│   │   └── ml/
│   │       └── train.py         # Train & save RandomForest model
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx       # Root layout + AuthProvider
    │   │   ├── globals.css      # Full design system (dark medical theme)
    │   │   ├── page.tsx         # Redirects → /login
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── symptoms/page.tsx
    │   │   ├── history/page.tsx
    │   │   ├── appointments/page.tsx
    │   │   └── profile/page.tsx
    │   ├── components/
    │   │   └── AppLayout.tsx    # Sidebar + nav + user badge
    │   ├── hooks/
    │   │   └── useAuth.tsx      # Auth context + login/register/logout
    │   └── lib/
    │       └── api.ts           # All API client functions
    ├── package.json
    ├── tsconfig.json
    └── next.config.js
```

---

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SECRET_KEY=your-super-secret-key-min-32-chars
```

### 3. Get Supabase Connection String

1. Go to [supabase.com](https://supabase.com) → your project
2. Settings → Database → Connection string → URI
3. Replace `[YOUR-PASSWORD]` with your DB password

### 4. Create Tables

```bash
# Tables auto-create on first run via SQLAlchemy
uvicorn app.main:app --reload
```

Visit `http://localhost:8000/docs` for interactive API docs.

### 5. (Optional) Train ML Model

```bash
cd app/ml
python train.py
# Saves model.pkl — improves symptom analysis accuracy
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                    | Description              | Auth |
|--------|-----------------------------|--------------------------|------|
| POST   | /api/auth/register          | Create account           | No   |
| POST   | /api/auth/login             | Get JWT token            | No   |
| GET    | /api/auth/me                | Current user             | Yes  |
| GET    | /api/users/profile          | Get health profile       | Yes  |
| POST   | /api/users/profile          | Create health profile    | Yes  |
| PUT    | /api/users/profile          | Update health profile    | Yes  |
| POST   | /api/symptoms/analyze       | AI symptom analysis      | Yes  |
| GET    | /api/history/               | Symptom check history    | Yes  |
| GET    | /api/history/stats          | Aggregated stats         | Yes  |
| GET    | /api/appointments/          | List appointments        | Yes  |
| POST   | /api/appointments/          | Book appointment         | Yes  |
| PUT    | /api/appointments/{id}      | Update/cancel            | Yes  |
| DELETE | /api/appointments/{id}      | Delete appointment       | Yes  |

---

## Database Schema (Supabase)

Tables are auto-created via SQLAlchemy ORM:

- **users** — email, hashed_password, full_name
- **health_profiles** — age, gender, blood_group, BMI data, conditions, emergency contact
- **symptom_checks** — symptoms (JSON), severity, risk_level, risk_score, AI recommendation
- **appointments** — doctor, specialty, datetime, status

---

## ML Symptom Analysis

The system uses a two-tier approach:

1. **RandomForest Model** (`model.pkl`) — trained on symptom text + severity + duration
2. **Rule-based fallback** — keyword matching against emergency/moderate/mild symptom lists

Risk levels:
- 🟢 **Mild** — Rest and monitor (score: 0.0–0.44)
- 🟡 **Moderate** — See a doctor within 24–48h (score: 0.45–0.74)
- 🔴 **Emergency** — Seek immediate care (score: 0.75–1.0)

---

## Security

- Passwords hashed with **bcrypt**
- JWT tokens with configurable expiry (default: 24h)
- Protected routes via `Depends(get_current_user)`
- Input validation via **Pydantic**
- CORS configured for frontend origin only

---

## Disclaimer

MedAssist is an educational/informational tool only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
