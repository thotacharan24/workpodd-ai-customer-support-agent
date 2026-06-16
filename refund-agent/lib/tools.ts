import customers from "../data/customers.json";
import orders from "../data/orders.json";
import { addLog, timedLog } from "./logger";

export async function getCustomer(id: string) {
  return timedLog({ node: "tool", tool: "getCustomer", action: "call", customerId: id }, async () => {
    const customer = (customers as any[]).find((x) => x.id === id) || null;
    return { success: true, data: customer, found: !!customer };
  });
}

export async function getOrder(orderId: string) {
  return timedLog({ node: "tool", tool: "getOrder", action: "call", orderId }, async () => {
    const order = (orders as any[]).find((x) => x.order_id === orderId) || null;
    return { success: !!order, data: order, found: !!order };
  });
}

export async function checkRefundPolicy(customer: any, order: any) {
  return timedLog({ node: "tool", tool: "checkRefundPolicy", action: "call", orderId: order?.order_id, customerId: customer?.id }, async () => {
    const violated: string[] = [];
    if (!customer) violated.push("Missing customer record (8)");
    if (!order) violated.push("Missing order information (8)");
    if (order && order.clearance_item) violated.push("Clearance item (2)");
    if (order && order.digital_product) violated.push("Digital product (3)");
    if (order && order.subscription) violated.push("Subscription payment (4)");
    if (customer && customer.fraud_flag) violated.push("Fraud flagged (6)");
    if (customer && customer.refund_count_last_90_days > 3) violated.push("More than 3 refunds in 90 days (5)");

    let eligibleByWindow = false;
    if (order) {
      const purchased = new Date(order.purchase_date);
      const diffDays = Math.floor((Date.now() - purchased.getTime()) / (1000 * 60 * 60 * 24));
      eligibleByWindow = diffDays <= 30;
      if (order.defective) eligibleByWindow = true;
      if (!eligibleByWindow) violated.push("Outside 30-day window (1)");
    }

    const approved = violated.length === 0 && eligibleByWindow;
    return { success: true, approved, violated, reason: violated.join("; ") };
  });
}

export async function approveRefund(details: any) {
  return timedLog({ node: "tool", tool: "approveRefund", action: "call", orderId: details.orderId, customerId: details.customerId, details }, async () => {
    return { success: true, data: { decision: "approved", ...details } };
  });
}

export async function denyRefund(details: any) {
  return timedLog({ node: "tool", tool: "denyRefund", action: "call", orderId: details.orderId, customerId: details.customerId, details }, async () => {
    return { success: true, data: { decision: "denied", ...details } };
  });
}
