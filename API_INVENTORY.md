# API Inventory — refund-agent

Generated: 2026-06-16

Discovered API routes (found under `refund-agent/pages/api/`):

- `GET /api/health`
  - Purpose: health check
  - Expected response: { status: 'ok', timestamp: '...' }

- `GET /api/logs`
  - Purpose: return in-memory reasoning logs (most recent first)
  - Expected response: array of LogEntry objects

- `GET /api/metrics`
  - Purpose: aggregate metrics from logs (total_requests, approvals, denials, escalations, fraud_cases, avg_processing_time)
  - Expected response: JSON with numeric fields

- `GET /api/orders`
  - Purpose: list orders from `data/orders.json`
  - Expected response: array of order objects (order_id, customer_id, purchase_date, item_name, amount, defective, digital_product, etc.)

- `GET /api/customers`
  - Purpose: list customers from `data/customers.json`
  - Expected response: array of customer objects (id, name, email, vip_status, refund_count_last_90_days, fraud_flag, etc.)

- `POST /api/refund`
  - Purpose: primary refund agent endpoint; triggers agent run for given `orderId`
  - Request body: { orderId: string }
  - Response: { orderId, evaluation } where `evaluation` contains approved:boolean, violated:[string], reason:string, explanation:string

- `POST /api/chat`
  - Purpose: chat assistant endpoint (not primary to refund flow)
  - Request body/response: chat messages (implementation-specific)

Notes:
- All endpoints are part of the `refund-agent` Next.js app and were reachable in this session at base URL `http://localhost:3004/api`.
- Example test commands used during audit are in `API_TEST_RESULTS.md`.
