from .langgraph import StateGraph
from .tools import (
    get_customer,
    load_policy,
    calculate_days_since_purchase,
    detect_fraud,
    check_refund_abuse,
    approve_refund,
    deny_refund,
    escalate_case,
    save_reasoning_log,
    build_reasoning_step,
)
from .services import generate_explanation
from datetime import datetime
import uuid

class RefundAgent:
    def __init__(self):
        self.graph = StateGraph("refund_decision_graph")
        self.graph.add_state("receive_request", self.receive_request, "find_customer")
        self.graph.add_state("find_customer", self.find_customer, "load_policy")
        self.graph.add_state("load_policy", self.load_policy, "evaluate_purchase")
        self.graph.add_state("evaluate_purchase", self.evaluate_purchase, "check_fraud")
        self.graph.add_state("check_fraud", self.check_fraud, "check_exceptions")
        self.graph.add_state("check_exceptions", self.check_exceptions, "finalize_decision")
        self.graph.add_state("finalize_decision", self.finalize_decision, None)

    def receive_request(self, context: dict) -> dict:
        request_id = str(uuid.uuid4())
        context["request_id"] = request_id
        context["steps"] = []
        context["timestamp"] = datetime.utcnow().isoformat()
        return context

    def find_customer(self, context: dict) -> dict:
        customer = get_customer(context["payload"].customer_id)
        context["customer"] = customer
        if customer is None:
            detail = f"Customer {context['payload'].customer_id} not found."
            context["steps"].append(build_reasoning_step("Customer Found", detail, False))
            save_reasoning_log(context["payload"].customer_id, context["request_id"], "Customer Found", detail, False)
            context["final_action"] = deny_refund
            context["reason_text"] = "Customer record not found."
            context["skip_processing"] = True
            return context
        detail = f"Customer {customer.name} found with fraud score {customer.fraud_score}."
        context["steps"].append(build_reasoning_step("Customer Found", detail, True))
        save_reasoning_log(customer.customer_id, context["request_id"], "Customer Found", detail, True)
        return context

    def load_policy(self, context: dict) -> dict:
        if context.get("skip_processing"):
            return context
        policy = load_policy()
        context["policy"] = policy
        context["steps"].append(build_reasoning_step("Policy Loaded", "Refund policy loaded from policy.txt.", True))
        save_reasoning_log(context["payload"].customer_id, context["request_id"], "Policy Loaded", "Loaded policy text.", True)
        return context

    def evaluate_purchase(self, context: dict) -> dict:
        if context.get("skip_processing"):
            return context
        payload = context["payload"]
        customer = context["customer"]
        days = calculate_days_since_purchase(customer.purchase_date, customer.delivery_date)
        context["days_since_purchase"] = days
        context["eligible_window"] = days <= 30
        context["steps"].append(build_reasoning_step("Evaluate Purchase", f"Purchase age = {days} days.", context["eligible_window"]))
        save_reasoning_log(customer.customer_id, context["request_id"], "Evaluate Purchase", f"Purchase age {days} days.", context["eligible_window"])

        if payload.digital_product:
            context["steps"].append(build_reasoning_step("Digital Product", "Digital product requests are not refundable.", False))
            save_reasoning_log(customer.customer_id, context["request_id"], "Digital Product", "Non-refundable digital item.", False)
            context["final_action"] = deny_refund
            context["reason_text"] = "Digital products are not refundable."
            return context

        if payload.used_product:
            context["steps"].append(build_reasoning_step("Used Product", "Used products are denied unless special error evidence is present.", False))
            save_reasoning_log(customer.customer_id, context["request_id"], "Used Product", "Used product detected.", False)
            context["final_action"] = deny_refund
            context["reason_text"] = "Used products are denied under policy."
            return context

        if payload.damage_reported or payload.wrong_item or payload.not_delivered:
            context["steps"].append(build_reasoning_step("Exception Match", "Damage, wrong item, or non-delivery qualifies for approval.", True))
            save_reasoning_log(customer.customer_id, context["request_id"], "Exception Match", "Exception condition met.", True)
            context["final_action"] = approve_refund
            context["reason_text"] = "Exception matches policy for approval."
            return context

        if context["eligible_window"]:
            context["final_action"] = approve_refund
            context["reason_text"] = "Request is inside the 30-day window and no disqualifying conditions were found."
        else:
            context["final_action"] = escalate_case if customer.loyalty_status.lower() == "premium" else deny_refund
            context["reason_text"] = "Request is outside the refund window. " + ("Escalation available for premium customer." if customer.loyalty_status.lower() == "premium" else "Refund window expired.")
        return context

    def check_fraud(self, context: dict) -> dict:
        if context.get("skip_processing"):
            return context
        customer = context["customer"]
        flagged = detect_fraud(customer)
        if flagged:
            detail = f"Fraud score {customer.fraud_score} exceeds threshold."
            context["steps"].append(build_reasoning_step("Check Fraud", detail, False))
            save_reasoning_log(customer.customer_id, context["request_id"], "Check Fraud", detail, False)
            context["final_action"] = deny_refund
            context["reason_text"] = "Fraud score too high."
        else:
            detail = f"Fraud score {customer.fraud_score} is within acceptable range."
            context["steps"].append(build_reasoning_step("Check Fraud", detail, True))
            save_reasoning_log(customer.customer_id, context["request_id"], "Check Fraud", detail, True)
        return context

    def check_exceptions(self, context: dict) -> dict:
        if context.get("skip_processing"):
            return context
        customer = context["customer"]
        abuse = check_refund_abuse(customer)
        if abuse:
            detail = f"Refund count {customer.refund_count} suggests possible abuse."
            context["steps"].append(build_reasoning_step("Check Refund Abuse", detail, False))
            save_reasoning_log(customer.customer_id, context["request_id"], "Check Refund Abuse", detail, False)
            context["final_action"] = deny_refund
            context["reason_text"] = "Refund abuse detected."
        else:
            detail = f"Refund count {customer.refund_count} is within normal limits."
            context["steps"].append(build_reasoning_step("Check Refund Abuse", detail, True))
            save_reasoning_log(customer.customer_id, context["request_id"], "Check Refund Abuse", detail, True)
        return context

    def finalize_decision(self, context: dict):
        decision_fn = context["final_action"]
        payload = context["payload"]
        if context.get("skip_processing"):
            explanation_text = "Customer record not found."
            payload_dict = payload.dict()
            payload_dict.pop('customer_id', None)
            result = deny_refund(context["request_id"], payload.customer_id, explanation_text, **payload_dict)
            customer_id = payload.customer_id
        else:
            customer = context["customer"]
            explanation_text = generate_explanation(customer, decision_fn.__name__.replace("_", " "), context["reason_text"])
            payload_dict = payload.dict()
            payload_dict.pop('customer_id', None)
            if decision_fn is approve_refund:
                result = approve_refund(
                    context["request_id"],
                    customer.customer_id,
                    explanation_text,
                    escalated=False,
                    **payload_dict,
                )
            else:
                result = decision_fn(context["request_id"], customer.customer_id, explanation_text, **payload_dict)
            customer_id = customer.customer_id
        context["steps"].append(build_reasoning_step("Decision", f"Final decision = {result['decision']}.", result["decision"] == "approved"))
        save_reasoning_log(customer_id, context["request_id"], "Decision", f"Final decision {result['decision']}.", result["decision"] == "approved")
        return {
            "request_id": context["request_id"],
            "customer_id": customer_id,
            "decision": result["decision"],
            "explanation": explanation_text,
            "steps": context["steps"],
            "escalated": result.get("escalated", False),
        }

    def run(self, payload):
        return self.graph.run("receive_request", payload=payload)
