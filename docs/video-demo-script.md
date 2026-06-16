# Video Demo Script

## Opening (0:00 - 0:45)
- Introduce yourself as a Senior Staff AI Engineer and Full-Stack Architect.
- Present the solution name: WorkPodd AI Refund Agent.
- Describe the end-to-end goal: an e-commerce refund assistant that approves or denies refunds using a policy-driven, audit-ready workflow.

## Architecture Overview (0:45 - 2:00)
- Show the application architecture diagram from `docs/architecture.md`.
- Explain the three layers:
  - Frontend: Next.js 15 customer chat and admin dashboard.
  - Backend: FastAPI, LangGraph-style workflow, SQLite CRM data.
  - AI: OpenAI is used to generate final explanations and enrich the decision path.
- Mention Docker Compose for local deployment.

## Agent Workflow (2:00 - 3:15)
- Walk through the refund decision flow:
  - Receive the request.
  - Find the customer in CRM.
  - Load refund policy dynamically.
  - Evaluate purchase age, fraud, abuse, and exceptions.
  - Approve, deny, or escalate.
  - Save reasoning logs for every step.
- Highlight that the workflow uses tool calling functions like `get_customer`, `load_policy`, `detect_fraud`, `check_refund_abuse`, `approve_refund`, `deny_refund`, and `escalate_case`.

## Customer Chat Demo (3:15 - 5:00)
- Open the home page and navigate to the customer chat page.
- Demonstrate a refund request for `CUST001` with a damaged item and show the approved decision.
- Show the response explanation and the reasoning steps displayed in the chat UI.
- Explain how each trace step maps to backend validation.

## Denied Refund Demo (5:00 - 6:00)
- Show a customer with an expired window, such as `CUST002`.
- Submit the request and highlight the denial or escalation decision.
- Explain how the refund window and policy rules drive that outcome.

## Fraud Demo (6:00 - 6:45)
- Demonstrate the fraudulent scenario with `CUST008`.
- Submit a refund request and show that the decision is denied automatically because of a high fraud score.
- Mention the fraud detection tool and audit logs.

## Admin Dashboard Demo (6:45 - 8:00)
- Navigate to the admin dashboard page.
- Show total requests, approvals, denials, escalations, and fraud case metrics.
- Scroll through the recent activity feed and reasoning logs table.
- Point out how the dashboard supports compliance review and decision traceability.

## Code Walkthrough (8:00 - 9:20)
- Open the backend code:
  - `backend/app/agent.py` for the LangGraph state workflow.
  - `backend/app/tools.py` for tool definitions.
  - `backend/app/services.py` for OpenAI explanation generation.
  - `backend/app/main.py` for endpoint wiring and metrics.
- Open the frontend code:
  - `frontend/app/chat/page.tsx` for the refund request flow.
  - `frontend/app/dashboard/page.tsx` for metrics and logs.
- Mention the seed data and policy text.

## Future Improvements (9:20 - 10:00)
- Talk about adding authentication and RBAC.
- Suggest production database migration and multi-tenant support.
- Mention richer analytics, notifications, and enhanced OpenAI conversational memory.
- Wrap up with why this architecture is strong for enterprise refund support.
