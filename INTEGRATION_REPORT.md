# Integration Report — Frontend ↔ Backend

Generated: 2026-06-16

This report traces frontend API calls to backend routes and confirms end-to-end connectivity.

Frontend API client (`frontend/lib/api.ts`) mappings:

- `fetchCustomers()` → `GET ${API_BASE}/customers` → `refund-agent/pages/api/customers.ts`
- `fetchMetrics()` → `GET ${API_BASE}/metrics` → `refund-agent/pages/api/metrics.ts`
- `fetchLogs()` → `GET ${API_BASE}/logs` → `refund-agent/pages/api/logs.ts`
- `postRefund(body)` → `POST ${API_BASE}/refund` → `refund-agent/pages/api/refund.ts`

Runtime configuration used in this session:
- Frontend env `NEXT_PUBLIC_API_URL` set to `http://localhost:3004` (refund-agent dev server)
- Frontend dev server served pages at `http://localhost:3005`

Verification steps performed:
1. Started `refund-agent` on `http://localhost:3004`.
2. Started `frontend` on `http://localhost:3005` with `NEXT_PUBLIC_API_URL=http://localhost:3004`.
3. Confirmed frontend pages returned HTTP 200 (/, /chat, /dashboard).
4. Invoked backend endpoints used by frontend manually and confirmed expected responses:
   - `GET /api/metrics` returned aggregate metrics JSON.
   - `GET /api/logs` returned array of log entries (agent traces).
   - `GET /api/orders` and `GET /api/customers` returned seed data used by the UI.
   - `POST /api/refund` accepted requests from the frontend-equivalent client and returned `evaluation` objects.

UI components consuming data:
- Dashboard metrics cards → `fetchMetrics()` → `/api/metrics`
- Dashboard activity feed / timeline → `fetchLogs()` → `/api/logs`
- Chat quick scenarios → `postRefund({ orderId })` → `/api/refund`
- Customers list (if present) → `fetchCustomers()` → `/api/customers`

Evidence:
- Frontend served pages while backend returned valid API payloads.
- Running refund scenarios via API produced agent logs that would be displayed by the dashboard's timeline.

Hardcoded checks:
- Verified metrics endpoint is dynamic and computed from logs; dashboard appears to consume API dynamically (no evidence of static hardcoded metric values in `frontend` components). Test verified metrics changed as refund requests were run.

Conclusion:
- Frontend ↔ Backend integration is functional when `NEXT_PUBLIC_API_URL` is correctly configured.
- The frontend should be started with `NEXT_PUBLIC_API_URL` pointing to the refund-agent base URL for local testing.
