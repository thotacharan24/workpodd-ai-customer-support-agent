import { Customer, Metrics, RefundDecision, LogEntry } from "../types";

// Connect to refund-agent service (primary backend)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error("Unable to load customers.");
  return res.json();
}

export async function fetchMetrics(): Promise<Metrics> {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error("Unable to load metrics.");
  return res.json();
}

export async function fetchLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${API_BASE}/logs`);
  if (!res.ok) throw new Error("Unable to load logs.");
  return res.json();
}

export async function postRefund(body: Record<string, any>): Promise<RefundDecision> {
  const res = await fetch(`${API_BASE}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Unable to submit refund request.");
  return res.json();
}

export async function postChat(body: { customer_id: string; message: string }): Promise<RefundDecision> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Unable to submit chat request.");
  return res.json();
}
