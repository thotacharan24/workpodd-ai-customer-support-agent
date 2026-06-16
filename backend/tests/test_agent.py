from app.agent import RefundAgent
from app.schemas import RefundPayload


def test_agent_approves_recent_purchase():
    agent = RefundAgent()
    payload = RefundPayload(
        customer_id="CUST001",
        reason="Product damaged",
        damage_reported=True,
        wrong_item=False,
        not_delivered=False,
        digital_product=False,
        used_product=False,
    )
    result = agent.run(payload)
    assert result["decision"] == "approved"
    assert isinstance(result["steps"], list)


def test_agent_denies_fraudulent_account():
    agent = RefundAgent()
    payload = RefundPayload(
        customer_id="CUST008",
        reason="Request refund",
        damage_reported=False,
        wrong_item=False,
        not_delivered=False,
        digital_product=False,
        used_product=False,
    )
    result = agent.run(payload)
    assert result["decision"] == "denied"
