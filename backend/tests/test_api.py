import os
from fastapi.testclient import TestClient
from app.main import app
from app.seed import seed_database

client = TestClient(app)


def test_seed_endpoint_creates_customers():
    response = client.post("/seed")
    assert response.status_code == 200
    data = response.json()
    assert data["seeded_customers"] >= 15


def test_get_customers_returns_profiles():
    response = client.get("/customers")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert len(payload) >= 15
    assert payload[0].get("customer_id")


def test_refund_approved_for_recent_purchase():
    response = client.post(
        "/refund",
        json={
            "customer_id": "CUST001",
            "reason": "Product arrived damaged",
            "damage_reported": True,
            "wrong_item": False,
            "not_delivered": False,
            "digital_product": False,
            "used_product": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "approved"


def test_refund_denied_for_expired_request():
    response = client.post(
        "/refund",
        json={
            "customer_id": "CUST002",
            "reason": "Refund after purchase window",
            "damage_reported": False,
            "wrong_item": False,
            "not_delivered": False,
            "digital_product": False,
            "used_product": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] in {"denied", "escalated"}


def test_refund_denied_for_high_fraud_score():
    response = client.post(
        "/refund",
        json={
            "customer_id": "CUST008",
            "reason": "Normal refund request",
            "damage_reported": False,
            "wrong_item": False,
            "not_delivered": False,
            "digital_product": False,
            "used_product": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "denied"
