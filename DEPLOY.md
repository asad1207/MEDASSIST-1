# MedAssist — Full Deployment Guide
## Stack: Supabase → Railway (backend) → Vercel (frontend)

---

## STEP 1 — Supabase (Database)

### 1.1 Create project
1. Go to https://supabase.com → Sign Up / Log In
2. Click **New Project**
3. Fill in:
   - **Name**: medassist
   - **Database Password**: create a strong password — SAVE THIS
   - **Region**: Southeast Asia (Singapore) — closest to India
4. Click **Create new project** — wait ~2 minutes

### 1.2 Get your connection string
1. In your project sidebar → **Settings** (gear icon) → **Database**
2. Scroll down to **Connection string**
3. Select the **URI** tab
4. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghij.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set above
6. **Save this** — you need it for Railway

### 1.3 Tables
Nothing to do — SQLAlchemy auto-creates all tables on first backend run.

---

## STEP 2 — Push code to GitHub

Open terminal in the `medassist-final/` folder:

```bash
git init
git add .
git commit -m "Initial MedAssist commit"
```

Then:
1. Go to https://github.com → **New repository**
2. Name it `medassist`
3. Keep it **Private** (health data)
4. Do NOT initialize with README (you already have files)
5. Copy the remote URL it shows, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/medassist.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Railway (Backend)

### 3.1 Create Railway account
1. Go to https://railway.app → **Login with GitHub**
2. Authorize Railway to access your repos

### 3.2 Deploy backend
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your `medassist` repo
4. Railway will start deploying — **STOP IT** first by clicking the service

### 3.3 Set Root Directory
1. Click your service → **Settings** tab
2. Under **Source** → set **Root Directory** to:
   ```
   medassist-final/backend
   ```
3. This tells Railway to only look at the backend folder

### 3.4 Add Environment Variables
Click your service → **Variables** tab → Add these one by one:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres` |
| `SECRET_KEY` | Any 40+ char random string, e.g. `medassist-super-secret-jwt-key-2025-production` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `ALLOWED_ORIGINS` | `http://localhost:3000` (update after Vercel deploy) |

### 3.5 Trigger redeploy
- Click **Deploy** → Railway builds and starts your FastAPI app
- Wait for green ✅ status

### 3.6 Get your backend URL
- Click your service → **Settings** → scroll to **Domains**
- Click **Generate Domain**
- You'll get something like: `https://medassist-production-xxxx.up.railway.app`
- **Save this URL** — you need it for Vercel

### 3.7 Verify backend is working
Open in browser:
```
https://YOUR-RAILWAY-URL.up.railway.app/health
```
Should return: `{"status": "healthy"}`

Also check API docs:
```
https://YOUR-RAILWAY-URL.up.railway.app/docs
```

---

## STEP 4 — Vercel (Frontend)

### 4.1 Create Vercel account
1. Go to https://vercel.com → **Continue with GitHub**
2. Authorize Vercel

### 4.2 Import project
1. Click **Add New** → **Project**
2. Find and select your `medassist` GitHub repo
3. Click **Import**

### 4.3 Configure build settings
On the configuration screen:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `medassist-final/frontend` |
| **Build Command** | `npm run build` (auto) |
| **Output Directory** | `.next` (auto) |

### 4.4 Add Environment Variable
Under **Environment Variables** section:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app` |

### 4.5 Deploy
- Click **Deploy**
- Wait ~2 minutes
- You'll get a URL like: `https://medassist-yourname.vercel.app`

### 4.6 Verify frontend works
- Open your Vercel URL
- You should see the MedAssist login page
- Try registering an account

---

## STEP 5 — Connect frontend ↔ backend (CORS)

Now that you have your Vercel URL, you need to tell the backend to accept requests from it.

1. Go to Railway → your service → **Variables**
2. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:3000,https://medassist-yourname.vercel.app
   ```
3. Railway will auto-redeploy

---

## STEP 6 — Final verification checklist

- [ ] `https://YOUR-RAILWAY-URL/health` returns `{"status":"healthy"}`
- [ ] `https://YOUR-RAILWAY-URL/docs` shows Swagger UI
- [ ] Vercel frontend loads the login page
- [ ] Can register a new account
- [ ] Can log in
- [ ] Can complete profile setup
- [ ] Can run symptom checker
- [ ] History is saved and visible
- [ ] Can book an appointment

---

## Troubleshooting

### Backend won't start on Railway
- Check **Logs** tab in Railway for error messages
- Make sure `DATABASE_URL` has the correct password (no special chars unescaped)
- Try: Settings → Redeploy

### Frontend shows "Network Error"
- Check `NEXT_PUBLIC_API_URL` in Vercel settings — must NOT have trailing slash
- Check CORS: `ALLOWED_ORIGINS` in Railway must include your exact Vercel URL
- Open browser DevTools → Network tab to see the failing request

### Database connection fails
- Supabase → Settings → Database → scroll to **Connection Pooling**
- Use the **pooled connection string** (port 6543) instead of direct (port 5432)
- Format: `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### psycopg2 error on Windows (local dev only)
```bash
python -m pip install psycopg2-binary --prefer-binary
```

---

## Architecture

```
User Browser
     │
     ▼
Vercel (Next.js frontend)
https://medassist.vercel.app
     │  HTTPS API calls
     ▼
Railway (FastAPI backend)
https://medassist-prod.up.railway.app
     │  SQL queries
     ▼
Supabase (PostgreSQL)
db.xxx.supabase.co:5432
```

---

## Local development (after deployment)

```bash
# Terminal 1 — Backend
cd medassist-final/backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
python -m pip install -r requirements.txt
# Create .env with your Supabase DATABASE_URL
uvicorn app.main:app --reload

# Terminal 2 — Frontend  
cd medassist-final/frontend
npm install
# .env.local already set to http://localhost:8000
npm run dev
```

Open http://localhost:3000
