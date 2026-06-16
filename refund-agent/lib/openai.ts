import OpenAI from "openai";
import { timedLog } from "./logger";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function explainDecision(payload: { customer: any; order: any; policy: string; evaluation: any; }) {
  const fallback = `Decision: ${payload.evaluation.approved ? "approved" : "denied"}. Reason: ${payload.evaluation.reason}`;
  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const system = "You are an assistant that cites policy rules when explaining refund decisions.";
  const user = `Customer: ${JSON.stringify(payload.customer)}\nOrder: ${JSON.stringify(payload.order)}\nPolicy: ${payload.policy}\nEvaluation: ${JSON.stringify(payload.evaluation)}\nPlease provide a concise decision summary, list violated rules (by number), and a confidence score.`;

  try {
    return await timedLog(
      {
        node: "tool",
        tool: "openai",
        action: "call",
        orderId: payload.order?.order_id,
        customerId: payload.customer?.id,
      },
      async () => {
        const resp: any = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          max_tokens: 200,
          temperature: 0.1,
        });

        return resp.choices?.[0]?.message?.content || fallback;
      }
    );
  } catch (err) {
    return fallback;
  }
}
