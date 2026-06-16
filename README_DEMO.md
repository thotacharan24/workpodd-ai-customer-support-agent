# Demo Verification Notes

This file documents the verification of sample customers and outcomes after running `POST /seed`.

Sample verification (performed via `POST /chat`):

- C001 → approved
  - Explanation: Request is inside the 30-day window and no disqualifying conditions were found.
- C010 → denied
  - Explanation: Request is outside the refund window. Refund window expired.
- C015 → denied (fraud)
  - Explanation: Fraud score too high.

Commands used to verify (PowerShell):

```powershell
# Seed DB
Invoke-WebRequest -Uri "http://localhost:8000/seed" -Method POST -UseBasicParsing

# Verify each customer
$body = @{customer_id='C001'; message='Request refund via chat'} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

# Repeat for C010 and C015
```

Files changed / added:
- `backend/app/seed.py` (added `C001`, `C010`, `C015` entries)
- `docs/demo_script.md`
- `architecture/diagram.mmd`
- `screenshots/.gitkeep`
- `README_DEMO.md`

