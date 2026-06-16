from types import SimpleNamespace
from app.tools import calculate_days_since_purchase, detect_fraud, check_refund_abuse, load_policy
from datetime import date, timedelta


def test_load_policy_contains_refund_terms():
    policy_text = load_policy()
    assert "Refund allowed" in policy_text
    assert "Fraud score" in policy_text


def test_calculate_days_since_purchase():
    purchase_date = date.today() - timedelta(days=15)
    delivery_date = date.today() - timedelta(days=12)
    age = calculate_days_since_purchase(purchase_date, delivery_date)
    assert age >= 15


def test_detect_fraud_threshold():
    customer = SimpleNamespace(fraud_score=85)
    assert detect_fraud(customer) is True
    customer.fraud_score = 10
    assert detect_fraud(customer) is False


def test_check_refund_abuse():
    customer = SimpleNamespace(refund_count=3)
    assert check_refund_abuse(customer) is True
    customer.refund_count = 1
    assert check_refund_abuse(customer) is False
