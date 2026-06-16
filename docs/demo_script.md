# Demo Script — WorkPodd AI Refund Agent

Goal: Show end-to-end refund decision flow, reasoning logs, and admin dashboard.

Steps:

1. Intro (30s)
   - Show app home at `http://localhost:3002`.
   - Explain components: Frontend chat, backend API, LangGraph decision engine, admin dashboard.

2. Seed DB (10s)
   - In terminal: `Invoke-WebRequest -Uri "http://localhost:8000/seed" -Method POST`.
   - Confirm seeded customers.

3. Customer Chat — Approved (1m)
   - Use `C001` (customer chat): enter Customer ID `C001`, message `Request refund via chat`.
   - Show assistant response: `approved` with explanation and timeline steps.

4. Customer Chat — Denied (1m)
   - Use `C010`: demonstrate `denied` due to refund window expired.

5. Customer Chat — Fraud Denied (1m)
   - Use `C015`: demonstrate `denied` due to high fraud score.

6. Admin Dashboard (1m)
   - Open `/dashboard` and show Recent Activity, Approval Trends, and Logs.
   - Click through a reasoning log for transparency.

7. Notes & Troubleshooting (30s)
   - Where to add `OPENAI_API_KEY` (`backend/.env`) to enable richer explanations.
   - How to change test customers in `backend/app/seed.py`.

8. Close (10s)
   - Summarize what was shown and where to find the repository files.

Timing: ~5 minutes total (trim or expand per need). 
