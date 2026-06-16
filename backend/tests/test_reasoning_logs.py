from app.seed import seed_database
from app.agent import RefundAgent
from app.tools import get_session
from app.schemas import RefundPayload


def test_reasoning_logs_created():
    seed_database()
    agent = RefundAgent()
    payload = RefundPayload(customer_id='C001', reason='test')
    res = agent.run(payload)
    # ensure logs were saved for the request
    session = get_session()
    try:
        from app.models import ReasoningLog
        logs = session.query(ReasoningLog).count()
        assert logs >= 1
    finally:
        session.close()
