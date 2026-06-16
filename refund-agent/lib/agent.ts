import { getCustomer, getOrder, checkRefundPolicy, approveRefund, denyRefund } from "./tools";
import { policyText } from "./policy";
import { explainDecision } from "./openai";
import { addLog } from "./logger";

type Context = {
  orderId: string;
  customerId?: string;
  customer?: any;
  order?: any;
  evaluation?: any;
};

export class StateGraph {
  states: Record<string, (ctx: Context) => Promise<Context>> = {};
  transitions: Record<string, string | null> = {};

  addState(name: string, fn: (ctx: Context) => Promise<Context>, next?: string | null) {
    this.states[name] = fn;
    this.transitions[name] = next ?? null;
  }

  async run(start: string, ctx: Context) {
    let current: string | null = start;
    while (current) {
      const fn = this.states[current];
      if (!fn) throw new Error(`State ${current} not found`);

      const startTime = Date.now();
      addLog({
        node: "agent",
        tool: "state",
        action: "enter",
        status: "pending",
        latency: 0,
        orderId: ctx.orderId,
        details: { state: current },
      });

      try {
        ctx = await fn(ctx);
        addLog({
          node: "agent",
          tool: "state",
          action: "exit",
          status: "success",
          latency: Date.now() - startTime,
          orderId: ctx.orderId,
          customerId: ctx.customerId,
          details: { state: current },
          result: ctx.evaluation,
        });
      } catch (error: any) {
        addLog({
          node: "agent",
          tool: "state",
          action: "error",
          status: "failure",
          latency: Date.now() - startTime,
          orderId: ctx.orderId,
          customerId: ctx.customerId,
          details: { state: current, error: error?.message ?? String(error) },
        });
        throw error;
      }

      current = this.transitions[current] ?? null;
    }
    return ctx;
  }
}

export function buildAgent() {
  const graph = new StateGraph();

  graph.addState("START", async (ctx) => ctx, "GetCustomer");

  graph.addState(
    "GetCustomer",
    async (ctx) => {
      const order = await getOrder(ctx.orderId);
      ctx.order = order.data;
      if (ctx.order) ctx.customerId = ctx.order.customer_id;
      const customer = ctx.customerId ? await getCustomer(ctx.customerId) : { success: false, data: null };
      ctx.customer = customer.data;
      return ctx;
    },
    "ValidatePolicy"
  );

  graph.addState(
    "ValidatePolicy",
    async (ctx) => {
      const evaluation = await checkRefundPolicy(ctx.customer, ctx.order);
      ctx.evaluation = evaluation;
      return ctx;
    },
    "Decision"
  );

  graph.addState(
    "Decision",
    async (ctx) => {
      const explanation = await explainDecision({ customer: ctx.customer, order: ctx.order, policy: policyText, evaluation: ctx.evaluation });
      ctx.evaluation.explanation = explanation;
      if (ctx.evaluation.approved) {
        await approveRefund({ orderId: ctx.order?.order_id, customerId: ctx.customer?.id, explanation });
      } else {
        await denyRefund({ orderId: ctx.order?.order_id, customerId: ctx.customer?.id, explanation, violated: ctx.evaluation.violated });
      }
      return ctx;
    },
    null
  );

  return graph;
}
