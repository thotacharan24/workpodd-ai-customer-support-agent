import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAgent } from '../../lib/agent';
import { addLog } from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  addLog({
    node: 'api',
    tool: 'refund',
    action: 'received',
    status: 'success',
    latency: 0,
    orderId,
  });

  try {
    const agent = buildAgent();
    const ctx = await agent.run('START', { orderId });

    addLog({
      node: 'api',
      tool: 'refund',
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
      tool: 'refund',
      action: 'error',
      status: 'failure',
      latency: 0,
      orderId,
      details: { error: error?.message ?? String(error) },
    });
    return res.status(500).json({ error: 'Agent failed to process refund' });
  }
}
