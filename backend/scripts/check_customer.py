from app.tools import get_session
from app.models import Customer
from datetime import datetime

def main():
    session = get_session()
    try:
        cust = session.query(Customer).filter(Customer.customer_id == 'CUST002').first()
        if not cust:
            print('CUST002 not found')
            return
        print('customer_id:', cust.customer_id)
        print('purchase_date:', cust.purchase_date)
        print('delivery_date:', cust.delivery_date)
        days = (datetime.utcnow().date() - cust.purchase_date).days
        print('days since purchase (utc):', days)
        print('refund_count:', cust.refund_count)
        print('loyalty_status:', cust.loyalty_status)
        print('fraud_score:', cust.fraud_score)
    finally:
        session.close()

if __name__ == '__main__':
    main()
