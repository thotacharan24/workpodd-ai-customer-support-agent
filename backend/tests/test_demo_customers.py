from app.seed import seed_database
from app.agent import RefundAgent
from app.schemas import RefundPayload


def test_demo_customers_decisions():
    # Reseed DB to ensure deterministic test data
    seeded = seed_database()
    assert seeded >= 15

    agent = RefundAgent()

    cases = [
        ("C001", "approved"),
        ("C010", "denied"),
        ("C015", "denied"),
    ]

    for customer_id, expected in cases:
        payload = RefundPayload(
            customer_id=customer_id,
            reason="Automated test request",
            damage_reported=False,
            wrong_item=False,
            not_delivered=False,
            digital_product=False,
            used_product=False,
        )
        result = agent.run(payload)
        assert result["decision"] == expected, f"{customer_id} expected {expected} got {result['decision']}"
