# PHASE 1: APPLICATION ARCHITECTURE ANALYSIS

**Date**: June 16, 2026  
**Status**: Complete  
**Verification Method**: Codebase Analysis

---

## 1. OVERALL ARCHITECTURE

### Deployment Model
**Multi-Service Next.js + FastAPI Hybrid Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                 │
│                     Port: 3000 (dev)                     │
│        (Premium SaaS UI with Framer Motion)              │
└──────────────────────┬──────────────────────────────────┘
                       │
         API Calls: POST /api/* endpoints
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────────┐  ┌───────▼────────────────┐
│  refund-agent (Next.js)│  │  backend (FastAPI)     │
│  Port: 3000 (dev)      │  │  Port: 8000 (dev)      │
│  Pages API Routes      │  │  REST API Routes       │
│  ├─/api/health         │  │  ├─/chat               │
│  ├─/api/refund         │  │  ├─/refund             │
│  ├─/api/logs           │  │  ├─/customers          │
│  ├─/api/chat           │  │  ├─/logs               │
│  ├─/api/customers      │  │  ├─/metrics            │
│  └─/api/orders         │  │  └─/seed               │
└────┬───────────────────┘  └────────────────────────┘
     │
     └─► LangGraph StateGraph Agent
         (Tool orchestration & state management)
```

### Current Issue (CRITICAL)
- **Frontend** (lib/api.ts) targets `http://localhost:8000` (FastAPI backend)
- **refund-agent** provides endpoints at `http://localhost:3000/api/*` (Next.js)
- **Mismatch**: Frontend pointing to FastAPI, but refund-agent is the active service

### Communication Flow

#### Current (Broken) Flow:
```
Frontend → http://localhost:8000/refund (FastAPI)
         → http://localhost:8000/customers
         → http://localhost:8000/logs
         → http://localhost:8000/metrics
```

#### Expected (Correct) Flow:
```
Frontend → http://localhost:3000/api/refund (refund-agent)
         → http://localhost:3000/api/customers
         → http://localhost:3000/api/logs
         → http://localhost:3000/api/metrics (to be created)
```

---

## 2. FRAMEWORK & STACK DETAILS

### Frontend Service
**Framework**: Next.js 15.2.1  
**UI Framework**: React 19.0.0  
**Language**: TypeScript 5.6.2  
**Styling**: Tailwind CSS 3.4.4  
**Port**: 3000 (dev mode)

**Dependencies**:
- `framer-motion@11.0.0` - Animations
- `recharts@2.12.0` - Charts
- `lucide-react@0.481.0` - Icons
- `@tanstack/react-query@5.0.0` - Data fetching
- `clsx@2.1.1` - Class utilities

**Entry Points**:
- `/pages/index.tsx` - Homepage
- `/pages/chat.tsx` - Customer chat
- `/pages/admin.tsx` - Admin dashboard

---

### Refund-Agent Service (Primary Backend)
**Framework**: Next.js 15.2.1 (Pages API)  
**Language**: TypeScript  
**Port**: 3000 (dev mode, but conflicts with frontend)  
**Architecture**: Stateless API + In-Memory State

**API Routes** (`/pages/api/`):
- `GET /api/health` - Health check
- `POST /api/refund` - Process refund (calls LangGraph agent)
- `GET /api/logs` - Retrieve stored logs
- `GET /api/customers` - List customers
- `GET /api/orders` - List orders
- `POST /api/chat` - Chat endpoint

**Core Libraries**:
- `next@15.2.1` - Framework
- `openai@4.17.0` - AI explanations
- `react@19.0.0` - Components
- `clsx@2.1.1` - Utilities

**State Management**: Custom logger + LangGraph StateGraph

---

### Backend Service (FastAPI - Secondary/Unused)
**Framework**: FastAPI 0.111.1  
**Language**: Python  
**Port**: 8000 (dev mode)  
**Database**: SQLite (via SQLAlchemy)  
**Architecture**: RESTful API + ORM models

**API Routes** (`/backend/app/main.py`):
- `POST /chat` - Chat endpoint
- `POST /refund` - Refund endpoint
- `GET /customers` - List customers (from DB)
- `GET /logs` - List logs (from DB)
- `GET /metrics` - Metrics summary
- `POST /seed` - Seed test data

**Core Libraries**:
- `fastapi==0.111.1` - Web framework
- `uvicorn==0.24.0` - ASGI server
- `sqlalchemy==2.0.20` - ORM
- `pydantic==2.6.0` - Validation
- `openai==1.10.0` - AI SDK
- `python-dotenv==1.0.0` - Config

---

## 3. DATABASE LAYER

### FastAPI Backend (Primary DB Storage)
**Type**: SQLite  
**Location**: `backend/` directory  
**Engine**: SQLAlchemy ORM

**Tables**:
1. `customers` - Customer profiles
2. `reasoning_logs` - Agent decision logs
3. `refund_requests` - Refund request history

**Models** (`backend/app/models.py`):
```python
- Customer (id, name, email, order_value, fraud_score, etc.)
- ReasoningLog (id, customer_id, request_id, timestamp, step, detail)
- RefundRequest (id, customer_id, decision, explanation, timestamp)
```

### Refund-Agent In-Memory Storage
**Type**: JavaScript Objects (In-Memory)  
**Location**: `refund-agent/lib/logger.ts`  
**Persistence**: None (lost on restart)

**Storage Structure**:
```typescript
LogEntry {
  id: number;
  timestamp: string;
  node: string;
  tool: string;
  action: string;
  status: string;
  latency: number;
  orderId: string;
  customerId?: string;
  result?: any;
  details?: any;
}
```

**Max Entries**: 500 (FIFO rotation)

---

## 4. AGENT ARCHITECTURE

### LangGraph-Style StateGraph (refund-agent)

**Location**: `refund-agent/lib/agent.ts`

**State Flow**:
```
START
  ↓
GetCustomer (fetch order + customer data)
  ↓
ValidatePolicy (apply 10 refund rules)
  ↓
Decision (approve/deny/escalate)
  ↓
Return evaluation
```

**Tool Registration**:
1. `getCustomer(customerId)` - Lookup customer profile
2. `getOrder(orderId)` - Lookup order details
3. `checkRefundPolicy(customer, order)` - Apply policy rules
4. `approveRefund(orderId)` - Log approval
5. `denyRefund(orderId, reason)` - Log denial

**Policy Engine**: 10 configurable rules  
**Policy Source**: `backend/app/policy.txt`

### Tool Execution Flow

```
Agent Receives RefundPayload
  ↓
State 1: Load order + customer
  → Tool: getOrder(orderId)
  → Tool: getCustomer(customerId)
  → LogEntry: "Customer lookup"
  ↓
State 2: Validate policy
  → Tool: checkRefundPolicy(...)
  → Rule 1: Refund window check
  → Rule 2: Fraud flag check
  → Rule 3: Digital product check
  → Rule 4-10: Additional checks
  → LogEntry: "Policy applied"
  ↓
State 3: Make decision
  → Decision: APPROVED | DENIED | ESCALATED
  → Tool: approveRefund() or denyRefund()
  → LogEntry: "Decision made"
  ↓
Return evaluation + explanation
```

---

## 5. EXTERNAL SERVICES

### OpenAI Integration
**Service**: OpenAI GPT-4o (optional)  
**Purpose**: Generate natural language explanations  
**Location**: `refund-agent/lib/openai.ts`

**Fallback**: Deterministic explanation if API key missing

---

## 6. DATA FLOW DIAGRAMS

### Refund Processing Flow

```
┌─────────────┐
│   Frontend  │
│  (Customer  │
│    Chat)    │
└──────┬──────┘
       │
       │ POST /api/refund {orderId: "ORD-001"}
       │
       ▼
┌──────────────────────┐
│  refund-agent API    │
│  /pages/api/refund.ts│
└──────┬───────────────┘
       │
       │ buildAgent().run("START", {orderId})
       │
       ▼
┌──────────────────────────────────┐
│   LangGraph StateGraph Workflow   │
│                                  │
│  START → GetCustomer →          │
│  ValidatePolicy → Decision      │
└──────┬───────────────────────────┘
       │
       │ Tool Calls
       ├─ getOrder(orderId)
       ├─ getCustomer(customerId)
       ├─ checkRefundPolicy(...)
       ├─ approveRefund() or denyRefund()
       │
       ├─ Mock Data Sources:
       │  ├─ orders.json
       │  ├─ customers.json
       │  ├─ policy.txt
       │
       ├─ Log Entry Creation
       │  └─ addLog(...)
       │
       ▼
┌────────────────────────┐
│  In-Memory Logger      │
│  (refund-agent/lib/)   │
│  Max 500 entries       │
└────────────────────────┘
       │
       ▼
┌────────────────────────┐
│  HTTP Response (200)   │
│  { orderId, evaluation,│
│    customerId, decision}│
└────────────────────────┘
```

### Dashboard Data Flow

```
Admin Dashboard (Frontend)
       │
       │ useQuery(fetchMetrics)
       │ useQuery(fetchLogs)
       │ useQuery(fetchCustomers)
       │
       ▼
Frontend API Client (lib/api.ts)
       │
       │ fetch("http://localhost:8000/metrics")
       │ fetch("http://localhost:8000/logs")
       │ fetch("http://localhost:8000/customers")
       │
       ▼
FastAPI Backend
│
├─ GET /metrics
│  └─ Query database for summary stats
│
├─ GET /logs
│  └─ Query database for reasoning logs
│
└─ GET /customers
   └─ Query database for customer list
```

---

## 7. TEST DATA SOURCES

### Mock Data (refund-agent)
- **Orders**: `refund-agent/data/orders.json` - 35 test orders
- **Customers**: `refund-agent/data/customers.json` - 20 customer profiles
- **Policy**: `backend/app/policy.txt` - 10 refund rules

### Special Test Order IDs
- `ORD-APPROVED-001` - Should APPROVE
- `ORD-DENIED-DIGITAL-001` - Should DENY (digital product)
- `ORD-DENIED-FRAUD-001` - Should DENY (fraud)
- `ORD-DEFECTIVE-001` - Should APPROVE (defective product exception)

---

## 8. CURRENT CRITICAL ISSUES

| Issue | Severity | Impact | Status |
|-------|----------|--------|--------|
| Frontend API calls FastAPI (port 8000) but refund-agent is on port 3000 | CRITICAL | All API calls fail | NOT FIXED |
| Frontend CSS syntax error (`font-inherit` class) | CRITICAL | Frontend build fails | FIXED |
| Missing `avg_processing_time` in Metrics type | HIGH | Dashboard metric fails | FIXED |
| Frontend build hasn't been tested with new dependencies | HIGH | Deployment blocked | NOT VERIFIED |
| Two Next.js apps conflict on port 3000 | HIGH | Can't run both simultaneously | DESIGN ISSUE |

---

## 9. ENVIRONMENT CONFIGURATION

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
**Issue**: Should target refund-agent, not FastAPI

### Refund-Agent (`.env` or `.env.local`)
```env
OPENAI_API_KEY=sk-...  # Optional
```

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite:///./db.sqlite
OPENAI_API_KEY=sk-...  # Optional
```

---

## 10. FILES & LOCATIONS SUMMARY

### Frontend (`/frontend`)
- **Pages**: app/page.tsx, app/chat/page.tsx, app/dashboard/page.tsx
- **Components**: components/ui/*.tsx (6 components)
- **API Client**: lib/api.ts
- **Types**: types.ts
- **Styles**: styles/globals.css, tailwind.config.ts

### Refund-Agent (`/refund-agent`)
- **API Routes**: pages/api/*.ts (6 endpoints)
- **Agent**: lib/agent.ts (StateGraph)
- **Tools**: lib/tools.ts (5 tool implementations)
- **Logger**: lib/logger.ts (In-memory logging)
- **Policy**: lib/policy.ts (rule engine)
- **Mock Data**: data/orders.json, data/customers.json
- **Pages**: pages/index.tsx, pages/chat.tsx, pages/admin.tsx

### Backend (`/backend`)
- **Main**: app/main.py (FastAPI app)
- **Models**: app/models.py (SQLAlchemy models)
- **Schemas**: app/schemas.py (Pydantic schemas)
- **Database**: app/database.py (DB config)
- **Tools**: app/tools.py (tool implementations)
- **Policy**: app/policy.txt (policy rules)
- **Seed Data**: app/seed.py

---

## 11. PORTS & SERVICES

| Service | Port | Status | Priority |
|---------|------|--------|----------|
| frontend (Next.js) | 3000 | Production | HIGH |
| refund-agent (Next.js) | 3000 (conflicts) | Primary Backend | HIGH |
| backend (FastAPI) | 8000 | Secondary/Unused | LOW |
| PostgreSQL/SQLite | N/A | In-file | MEDIUM |

**Port Conflict**: Both frontend and refund-agent default to port 3000

---

## RECOMMENDATIONS FOR PHASE 2

1. **FIX CRITICAL ARCHITECTURE ISSUE**:
   - Update frontend `lib/api.ts` to point to refund-agent endpoints
   - OR move refund-agent to port 3001 and update frontend config
   - OR create a unified backend service

2. **Port Allocation Strategy**:
   - refund-agent: Port 3001 (primary backend API)
   - frontend: Port 3000 (customer-facing UI)
   - backend (FastAPI): Port 8000 (optional, for reference)

3. **Environment Setup**:
   - Create `.env.local` files with correct port mappings
   - Update frontend API_BASE URL
   - Document in README

4. **Service Start Order**:
   - Start refund-agent first (3001)
   - Start frontend second (3000)
   - Verify connectivity

---

## SUMMARY

✅ **Architecture Analyzed**: Multi-service Next.js + FastAPI  
❌ **Critical Issue Found**: API URL mismatch (frontend → FastAPI, but refund-agent is active)  
🔧 **Immediate Action Required**: Fix API connectivity before Phase 2

**Status**: Ready for Phase 2 Backend Verification (once API URL fixed)

---

**Generated**: June 16, 2026  
**Next Phase**: PHASE 2 — Backend Verification & API Testing
