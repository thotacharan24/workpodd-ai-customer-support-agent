export interface Customer {
  customer_id: string;
  name: string;
  email: string;
  purchase_date: string;
  delivery_date: string;
  product_name: string;
  product_type: string;
  order_value: number;
  refund_count: number;
  loyalty_status: string;
  fraud_score: number;
  country: string;
  last_refund_decision: string;
}

export interface ReasoningStep {
  step: string;
  detail: string;
  approved: boolean;
}

export interface RefundDecision {
  request_id: string;
  customer_id: string;
  decision: string;
  explanation: string;
  steps: ReasoningStep[];
  escalated: boolean;
}

export interface Metrics {
  total_requests: number;
  approvals: number;
  denials: number;
  escalations: number;
  fraud_cases: number;
  avg_processing_time?: number;
}

export interface LogEntry {
  id: number;
  customer_id: string;
  request_id: string;
  timestamp: string;
  step: string;
  detail: string;
  approved: boolean;
}
