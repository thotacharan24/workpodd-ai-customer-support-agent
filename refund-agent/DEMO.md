Demo Scenarios
=================

Steps to prepare and run the demo locally:

1. Start backend

```powershell
cd backend
.\.venv_backend\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Seed the database (if not already seeded)

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:8000/seed
```

3. Start the refund-agent frontend

```powershell
cd refund-agent
npm install
npm run dev
# open http://localhost:3000/demo
```

Demo scenarios on `/demo` call the backend `/chat` endpoint for the following customers:
- C001 — Approved refund (within 15 days)
- C010 — Denied (outside refund window)
- C015 — Denied (fraud)

Verify the decision, explanation, and reasoning steps are shown in the UI.
