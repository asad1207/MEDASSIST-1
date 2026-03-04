#!/bin/bash
# MedAssist Quick Start

echo "🩺 MedAssist — Quick Start"
echo ""

# Backend
echo "📦 Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate 2>/dev/null || venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
echo ""
echo "⚠️  Edit backend/.env with your Supabase DATABASE_URL and SECRET_KEY"
echo ""

# Frontend
echo "📦 Setting up frontend..."
cd ../frontend
npm install
cp .env.local.example .env.local
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start:"
echo "  Terminal 1 → cd backend && uvicorn app.main:app --reload"
echo "  Terminal 2 → cd frontend && npm run dev"
echo ""
echo "Open http://localhost:3000"
