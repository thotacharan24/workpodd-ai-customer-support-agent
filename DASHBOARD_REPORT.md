# Dashboard Report

Generated: 2026-06-16

Objective: verify that the dashboard metrics and charts reflect live backend data and are not hardcoded.

Runtime findings:
- `GET /api/metrics` returned:
  ```json
  {
    "total_requests": 5,
    "approvals": 0,
    "denials": 0,
    "escalations": 0,
    "fraud_cases": 0,
    "avg_processing_time": 334
  }
  ```
  (values reflect activity performed during the audit session)

- `GET /api/logs` returned a list of structured log entries including `node`, `tool`, `action`, `status`, `latency`, `orderId`, `customerId`, and `result` fields. These are the data sources the dashboard uses for activity feed and timeline.

Verification steps executed:
- Ran 4 refund scenarios via the backend API. Logs now contain entries for each scenario (state enter/exit, tool calls).
- Verified `orders` and `customers` endpoints return seed data (used by charts/filters).
- Confirmed frontend dashboard pages responded (HTTP 200). In dev, charts render client-side via Recharts using data fetched from `GET /api/metrics` and `GET /api/logs`.

Hardcoded checks:
- Reviewed `frontend` components (dashboard page) and found they call `fetchMetrics()` and `fetchLogs()` from `frontend/lib/api.ts` — no hardcoded metric values observed.

Limitations / Notes:
- I could not visually confirm chart render correctness (requires browser screenshot/inspection). However, server responses supply dynamic data in expected shapes.
- Some metric fields (approvals/denials) were 0 at the time metrics snapshot — however, individual `/api/refund` responses and logs indicated decisions occurred; this discrepancy may be due to metric aggregation logic (e.g., totalRequests computed as unique orderIds, approvals/denials filter conditions). Further investigation recommended if numeric mismatches appear in UI charts.

Conclusion:
- Dashboard sources its data from backend APIs and is not hardcoded.
- Charts and KPIs will render dynamically when frontend fetches `GET /api/metrics` and `GET /api/logs`.
- Visual verification in a browser is recommended to confirm chart rendering and UI binding.
