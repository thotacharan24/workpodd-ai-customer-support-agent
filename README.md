# WorkPodd AI Customer Support Refund Agent

![Tests](https://img.shields.io/badge/tests-pytest-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent-orange)

An AI-powered customer support platform that automates e-commerce refund decisions using policy-aware reasoning, fraud detection, tool-calling workflows, and real-time decision traces.

Built as part of the WorkPodd Full-Stack AI Assessment.

---

# Overview

This project demonstrates a production-style AI customer support agent capable of:

* Processing refund requests
* Enforcing refund policies
* Detecting fraudulent refund attempts
* Generating transparent reasoning logs
* Supporting customer chat interactions
* Providing operational visibility through an admin dashboard

The system combines FastAPI, LangGraph-inspired agent workflows, OpenAI-powered explanations, and a modern Next.js frontend.

---

# Key Features

### AI Refund Decision Engine

* Approves eligible refunds
* Denies policy violations
* Escalates premium customer edge cases

### Policy Enforcement

The agent validates:

* Refund window eligibility
* Product type restrictions
* Fraud risk
* Refund abuse patterns
* Customer loyalty exceptions

### Fraud Detection

* Fraud scoring
* Risk-based denial workflows
* Audit trail generation

### Customer Chat Interface

* AI-powered refund assistance
* Real-time refund status
* Transparent explanations

### Admin Dashboard

* Refund analytics
* Customer insights
* Agent reasoning traces
* Fraud monitoring
* Operational metrics

### Reasoning Logs

Every decision includes:

* Policy evaluation
* Fraud checks
* Tool execution logs
* Decision rationale
* Timestamps

---

# Architecture

```text
Customer Chat
      │
      ▼
Refund Agent API
      │
      ▼
Decision Engine
      │
 ┌────┼────┐
 ▼    ▼    ▼
CRM Policy Fraud
Tool Tool Tool
      │
      ▼
Decision Result
      │
      ▼
Reasoning Logs
      │
      ▼
Admin Dashboard
```

---

# Technology Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Recharts

## Backend

* FastAPI
* Python
* SQLite
* Pydantic

## AI & Agent Layer

* LangGraph-style workflow orchestration
* OpenAI integration
* Tool-calling architecture
* Policy reasoning engine

## DevOps

* Docker
* Docker Compose
* GitHub

---

# Project Structure

```text
workpodd-ai-customer-support-agent/

backend/
│
├── app/
├── database/
├── models/
├── services/
├── policy.txt
└── main.py

frontend/
│
├── app/
├── components/
├── dashboard/
└── services/

refund-agent/
│
├── pages/
├── components/
└── lib/

docs/
└── screenshots/

README.md
docker-compose.yml
.env.example
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/thotacharan24/workpodd-ai-customer-support-agent.git

cd workpodd-ai-customer-support-agent
```

## Configure Environment

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# Running Backend

```bash
cd backend

python -m venv .venv_backend

.\.venv_backend\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URL:

```text
http://localhost:8000
```

---

# Seed Demo Data

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:8000/seed
```

This creates:

* Customer profiles
* Orders
* Fraud scenarios
* Premium customer cases

---

# Running Frontend

```bash
cd refund-agent

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# API Endpoints

## Health

```http
GET /health
```

## Customers

```http
GET /customers
```

## Metrics

```http
GET /metrics
```

## Logs

```http
GET /logs
```

## Chat

```http
POST /chat
```

Request:

```json
{
  "customer_id": "C001",
  "message": "I want a refund"
}
```

## Refund

```http
POST /refund
```

Request:

```json
{
  "customer_id": "C001",
  "reason": "Product defective"
}
```

---

# Demo Scenarios

## Scenario 1 — Approved Refund

Customer:

```text
C001
```

Result:

```text
Refund Approved
```

Reason:

```text
Within refund policy window
```

---

## Scenario 2 — Policy Violation

Customer:

```text
C010
```

Result:

```text
Refund Denied
```

Reason:

```text
Outside refund eligibility period
```

---

## Scenario 3 — Fraud Detection

Customer:

```text
C015
```

Result:

```text
Refund Denied
```

Reason:

```text
Fraud score exceeds threshold
```

---

## Scenario 4 — Premium Customer Escalation

Customer:

```text
Premium Customer
```

Result:

```text
Escalated
```

Reason:

```text
Requires manual review
```

---

# WorkPodd Assessment Requirements Covered

* CRM Database
* Refund Policy Engine
* AI Agent Workflow
* Tool Calling
* Fraud Detection
* Customer Chat
* Admin Dashboard
* Reasoning Logs
* Analytics Metrics
* API Integration
* End-to-End Refund Processing

---

 screenshots:

```text
home-page.png

customer-chat.png

approved-refund.png

denied-refund.png

fraud-detection.png

admin-dashboard.png

reasoning-logs.png
```

Then reference them here:

```md
![Home](docs/screenshots/home-page.png)

![Customer Chat](docs/screenshots/customer-chat.png)

![Dashboard](docs/screenshots/admin-dashboard.png)

![Reasoning Logs](docs/screenshots/reasoning-logs.png)
```

---

# Testing

Backend Tests

```bash
cd backend

pytest
```

Frontend Build

```bash
npm run build
```

---

# Future Improvements

* Role-based authentication
* Multi-agent workflows
* Voice support
* Email notifications
* Human escalation queue
* PostgreSQL support
* Production deployment
* Advanced analytics

---

# Repository

https://github.com/thotacharan24/workpodd-ai-customer-support-agent

---

# Author

**Charan Thota**

WorkPodd Full-Stack AI Assessment Submission
