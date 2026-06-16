import os
import openai
from .models import Customer

openai.api_key = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")


def generate_explanation(customer: Customer, decision: str, reasons: str) -> str:
    if not openai.api_key:
        return f"Decision: {decision}. Reason: {reasons}"

    prompt = (
        "You are an intelligent refund support agent. "
        f"Customer {customer.customer_id} is requesting a refund. Decision: {decision}. "
        f"Provide a concise explanation with policy rationale: {reasons}."
    )
    try:
        response = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "Support agent should explain refund decisions clearly."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=180,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return f"Decision: {decision}. Reason: {reasons}"
