from fastapi import FastAPI, Depends
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .schemas import (
    ChatMessage,
    RefundPayload,
    OrderRefundRequest,
    RefundDecision,
    CustomerRead,
    LogRead,
    MetricSummary,
    SeedResponse,
)
from .models import Customer, ReasoningLog, RefundRequest
from .seed import seed_database
from .agent import RefundAgent
from typing import List

app = FastAPI(
    title="WorkPodd AI Refund Agent",
    description="AI-powered customer support for e-commerce refunds with decision logging and audit-ready workflows.",
    version="1.0.0",
)

# Load environment variables from a .env file if present (OPENAI_API_KEY etc.)
load_dotenv()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

refund_agent = RefundAgent()


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/chat", response_model=RefundDecision)
def create_chat(request: ChatMessage):
    payload = RefundPayload(customer_id=request.customer_id, reason=request.message)
    decision = refund_agent.run(payload)
    return RefundDecision(
        request_id=decision["request_id"],
        customer_id=decision["customer_id"],
        decision=decision["decision"],
        explanation=decision["explanation"],
        steps=[
            {
                "step": step["step"],
                "detail": step["detail"],
                "approved": step["approved"],
            }
            for step in decision["steps"]
        ],
        escalated=decision["escalated"],
    )

@app.post("/refund", response_model=RefundDecision)
def request_refund(request: OrderRefundRequest, db: Session = Depends(get_db)):
    # Allow calling with customer_id (demo/test) or map orderId to a customer
    if request.customer_id:
        customer_id = request.customer_id
    else:
        order_to_customer_map = {
            "ORD-APPROVED-001": "C001",
            "ORD-DENIED-DIGITAL-001": "CUST005",
            "ORD-DENIED-FRAUD-001": "CUST008",
            "ORD-DEFECTIVE-001": "CUST002",
            # demo-friendly aliases
            "ORD-C001": "C001",
            "ORD-C010": "C010",
            "ORD-C015": "C015",
        }
        customer_id = order_to_customer_map.get(request.orderId, "C001")

    payload = RefundPayload(
        customer_id=customer_id,
        reason=request.reason,
    )
    decision = refund_agent.run(payload)
    return RefundDecision(
        request_id=decision["request_id"],
        customer_id=decision["customer_id"],
        decision=decision["decision"],
        explanation=decision["explanation"],
        steps=[
            {
                "step": step["step"],
                "detail": step["detail"],
                "approved": step["approved"],
            }
            for step in decision["steps"]
        ],
        escalated=decision["escalated"],
    )

@app.get("/customers", response_model=List[CustomerRead])
def list_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).order_by(Customer.name).all()
    return customers

@app.get("/logs", response_model=List[LogRead])
def list_logs(db: Session = Depends(get_db)):
    logs = db.query(ReasoningLog).order_by(ReasoningLog.timestamp.desc()).limit(200).all()
    return logs

@app.get("/metrics", response_model=MetricSummary)
def metrics(db: Session = Depends(get_db)):
    total_requests = db.query(RefundRequest).count()
    approvals = db.query(RefundRequest).filter(RefundRequest.decision == "approved").count()
    denials = db.query(RefundRequest).filter(RefundRequest.decision == "denied").count()
    escalations = db.query(RefundRequest).filter(RefundRequest.decision == "escalated").count()
    fraud_cases = db.query(ReasoningLog).filter(ReasoningLog.step == "Check Fraud", ReasoningLog.approved.is_(False)).count()
    return MetricSummary(
        total_requests=total_requests,
        approvals=approvals,
        denials=denials,
        escalations=escalations,
        fraud_cases=fraud_cases,
    )

@app.get("/health")
def health():
    return {"status": "healthy", "message": "WorkPodd AI Refund Agent is running."}

@app.post("/seed", response_model=SeedResponse)
def run_seed():
    count = seed_database()
    return SeedResponse(seeded_customers=count)
