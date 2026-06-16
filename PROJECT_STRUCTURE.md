# Project Structure — WorkPodd AI Refund Agent

Generated: 2026-06-16

Repository root: c:\Users\vishr\projects\workpodd-ai-agent

Top-level folders:
- `refund-agent/` — Next.js pages-based application exposing API routes under `pages/api/` (refund agent, metrics, logs, orders, customers, health, chat). Contains `lib/` with agent, tools, logger, policy, openai wrappers and `data/` JSON seed files.
- `frontend/` — Next.js (App Router) premium UI app (homepage, /chat, /dashboard), Tailwind, Framer Motion, Recharts; client code uses `lib/api.ts` to call backend endpoints.
- `backend/` — separate backend service referenced by `docker-compose.yml` (Dockerfile present). Not the same as `refund-agent` Next.js app.
- `docs/` — architecture docs.

Package managers:
- Node / npm (Node.js v22.17.0, npm v10.9.2 detected in environment)
- `refund-agent/package.json` and `frontend/package.json` control respective apps.

Database / data stores:
- `refund-agent/data/*.json` — seed data (customers.json, orders.json).
- In-memory logs (non-persistent) implemented in `refund-agent/lib/logger.ts` (FIFO cap 500).
- `backend` service (in `docker-compose.yml`) references `backend/workpodd_refunds.db` — file-backed DB used by that separate service (not covered by `refund-agent` code).

API routes (refund-agent):
- `GET /api/health` — health check
- `GET /api/logs` — in-memory logs
- `GET /api/metrics` — aggregated metrics from logs
- `GET /api/orders` — list orders from seed JSON
- `GET /api/customers` — list customers from seed JSON
- `POST /api/refund` — run refund agent for an `orderId`
- `POST /api/chat` — chat assistant endpoint

Agent workflow (`refund-agent/lib/agent.ts`):
- StateGraph with states: `START` → `GetCustomer` → `ValidatePolicy` → `Decision`.
- Tools used: `getOrder`, `getCustomer`, `checkRefundPolicy`, `approveRefund`, `denyRefund` (tools in `refund-agent/lib/tools.ts`).
- Explanations: `explainDecision` in `refund-agent/lib/openai.ts` (uses OpenAI if key provided).

Environment variables used/relevant:
- `NEXT_PUBLIC_API_URL` — frontend uses to point to backend API (set when starting frontend dev server in this session to `http://localhost:3004`).
- `OPENAI_API_KEY` — optional for `refund-agent` to call OpenAI; missing/invalid keys will cause openai call failures (observed 429 quota error during logs).

Notes:
- `refund-agent` is runnable as a standalone Next.js app (dev: `npm run dev`), currently responding on `http://localhost:3004` in this session.
- `frontend` dev server was started with `NEXT_PUBLIC_API_URL=http://localhost:3004` and served pages on `http://localhost:3005` in this session.

Next: start backend and frontend (already done here), test API routes and agent scenarios, and produce runtime reports.
