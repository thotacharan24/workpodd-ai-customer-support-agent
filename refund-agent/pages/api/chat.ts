import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAgent } from '../../lib/agent';
import { addLog } from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const match = message.match(/order\s+(ORD-[A-Z0-9-]+)/i);
  if (!match) return res.status(400).json({ error: 'Order id not found in message' });
  const orderId = match[1];

  addLog({
    node: 'api',
    tool: 'chat',
    action: 'received',
    status: 'success',
    latency: 0,
    orderId,
    details: { message },
  });

  try {
    const agent = buildAgent();
    const ctx = await agent.run('START', { orderId });

    addLog({
      node: 'api',
      tool: 'chat',
      action: 'completed',
      status: 'success',
      latency: 0,
      orderId,
      result: ctx.evaluation,
    });

    return res.status(200).json({ orderId, evaluation: ctx.evaluation });
  } catch (error: any) {
    addLog({
      node: 'api',
      tool: 'chat',
      action: 'error',
      status: 'failure',
      latency: 0,
      orderId,
      details: { error: error?.message ?? String(error) },
    });
    return res.status(500).json({ error: 'Agent failed to process request' });
  }
}
