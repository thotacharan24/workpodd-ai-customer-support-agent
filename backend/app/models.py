from sqlalchemy import Column, Integer, String, Date, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    purchase_date = Column(Date, nullable=False)
    delivery_date = Column(Date, nullable=False)
    product_name = Column(String, nullable=False)
    product_type = Column(String, nullable=False)
    order_value = Column(Float, nullable=False)
    refund_count = Column(Integer, default=0)
    loyalty_status = Column(String, nullable=False)
    fraud_score = Column(Integer, nullable=False)
    country = Column(String, nullable=False)
    last_refund_decision = Column(String, default="None")
    is_active = Column(Boolean, default=True)

class ReasoningLog(Base):
    __tablename__ = "reasoning_logs"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, nullable=False, index=True)
    request_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    step = Column(String, nullable=False)
    detail = Column(Text, nullable=False)
    approved = Column(Boolean, nullable=False)

class RefundRequest(Base):
    __tablename__ = "refund_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String, unique=True, nullable=False, index=True)
    customer_id = Column(String, nullable=False, index=True)
    reason = Column(String, nullable=False)
    damage_reported = Column(Boolean, default=False)
    wrong_item = Column(Boolean, default=False)
    not_delivered = Column(Boolean, default=False)
    digital_product = Column(Boolean, default=False)
    used_product = Column(Boolean, default=False)
    decision = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    escalated = Column(Boolean, default=False)
    handled = Column(Boolean, default=False)
