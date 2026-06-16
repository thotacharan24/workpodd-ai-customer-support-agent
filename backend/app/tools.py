from typing import Dict, List, Optional
from datetime import datetime, date
from .models import Customer, ReasoningLog, RefundRequest
from .database import SessionLocal
from sqlalchemy.orm import Session
import uuid
import os

POLICY_PATH = os.path.join(os.path.dirname(__file__), "policy.txt")


def get_session() -> Session:
    return SessionLocal()


def get_customer(customer_id: str) -> Optional[Customer]:
    with get_session() as session:
        return session.query(Customer).filter(Customer.customer_id == customer_id).first()


def load_policy() -> str:
    with open(POLICY_PATH, "r", encoding="utf-8") as file:
        return file.read().strip()


def calculate_days_since_purchase(purchase_date: date, delivery_date: date) -> int:
    reference_date = max(datetime.utcnow().date(), delivery_date)
    return (reference_date - purchase_date).days


def detect_fraud(customer: Customer) -> bool:
    return customer.fraud_score > 80


def check_refund_abuse(customer: Customer) -> bool:
    return customer.refund_count >= 3


def approve_refund(request_id: str, customer_id: str, explanation: str, escalated: bool = False, **kwargs) -> Dict:
    with get_session() as session:
        refund = RefundRequest(
            request_id=request_id,
            customer_id=customer_id,
            reason=kwargs.get("reason", "approved"),
            damage_reported=kwargs.get("damage_reported", False),
            wrong_item=kwargs.get("wrong_item", False),
            not_delivered=kwargs.get("not_delivered", False),
            digital_product=kwargs.get("digital_product", False),
            used_product=kwargs.get("used_product", False),
            decision="approved",
            explanation=explanation,
            escalated=escalated,
            handled=True,
        )
        session.add(refund)
        customer = session.query(Customer).filter(Customer.customer_id == customer_id).first()
        if customer:
            customer.refund_count += 1
            customer.last_refund_decision = "approved"
        session.commit()
    return {"request_id": request_id, "decision": "approved", "explanation": explanation, "escalated": escalated}


def deny_refund(request_id: str, customer_id: str, explanation: str, **kwargs) -> Dict:
    with get_session() as session:
        refund = RefundRequest(
            request_id=request_id,
            customer_id=customer_id,
            reason=kwargs.get("reason", "denied"),
            damage_reported=kwargs.get("damage_reported", False),
            wrong_item=kwargs.get("wrong_item", False),
            not_delivered=kwargs.get("not_delivered", False),
            digital_product=kwargs.get("digital_product", False),
            used_product=kwargs.get("used_product", False),
            decision="denied",
            explanation=explanation,
            escalated=False,
            handled=True,
        )
        session.add(refund)
        customer = session.query(Customer).filter(Customer.customer_id == customer_id).first()
        if customer:
            customer.last_refund_decision = "denied"
        session.commit()
    return {"request_id": request_id, "decision": "denied", "explanation": explanation, "escalated": False}


def escalate_case(request_id: str, customer_id: str, explanation: str, **kwargs) -> Dict:
    with get_session() as session:
        refund = RefundRequest(
            request_id=request_id,
            customer_id=customer_id,
            reason=kwargs.get("reason", "escalated"),
            damage_reported=kwargs.get("damage_reported", False),
            wrong_item=kwargs.get("wrong_item", False),
            not_delivered=kwargs.get("not_delivered", False),
            digital_product=kwargs.get("digital_product", False),
            used_product=kwargs.get("used_product", False),
            decision="escalated",
            explanation=explanation,
            escalated=True,
            handled=False,
        )
        session.add(refund)
        customer = session.query(Customer).filter(Customer.customer_id == customer_id).first()
        if customer:
            customer.last_refund_decision = "escalated"
        session.commit()
    return {"request_id": request_id, "decision": "escalated", "explanation": explanation, "escalated": True}


def save_reasoning_log(customer_id: str, request_id: str, step: str, detail: str, approved: bool) -> None:
    with get_session() as session:
        log = ReasoningLog(
            customer_id=customer_id,
            request_id=request_id,
            step=step,
            detail=detail,
            approved=approved,
        )
        session.add(log)
        session.commit()


def build_reasoning_step(step: str, detail: str, approved: bool) -> Dict:
    return {"step": step, "detail": detail, "approved": approved}
