from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ChatMessage(BaseModel):
    customer_id: str
    message: str

class RefundPayload(BaseModel):
    customer_id: str
    reason: str
    damage_reported: bool = False
    wrong_item: bool = False
    not_delivered: bool = False
    digital_product: bool = False
    used_product: bool = False

class OrderRefundRequest(BaseModel):
    orderId: Optional[str] = None
    customer_id: Optional[str] = None
    reason: Optional[str] = "Customer initiated refund request"

class ReasoningStep(BaseModel):
    step: str
    detail: str
    approved: bool

class RefundDecision(BaseModel):
    request_id: str
    customer_id: str
    decision: str
    explanation: str
    steps: List[ReasoningStep]
    escalated: bool

class CustomerRead(BaseModel):
    customer_id: str
    name: str
    email: str
    purchase_date: date
    delivery_date: date
    product_name: str
    product_type: str
    order_value: float
    refund_count: int
    loyalty_status: str
    fraud_score: int
    country: str
    last_refund_decision: str

    class Config:
        orm_mode = True

class LogRead(BaseModel):
    id: int
    customer_id: str
    request_id: str
    timestamp: str
    step: str
    detail: str
    approved: bool

    class Config:
        orm_mode = True

class MetricSummary(BaseModel):
    total_requests: int
    approvals: int
    denials: int
    escalations: int
    fraud_cases: int

class SeedResponse(BaseModel):
    seeded_customers: int
