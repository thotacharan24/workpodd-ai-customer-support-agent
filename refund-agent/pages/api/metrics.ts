import type { NextApiRequest, NextApiResponse } from 'next';
import { getLogs } from '../../lib/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const logs = getLogs();
  
  // Calculate metrics from logs
  const totalRequests = new Set(logs.map(l => l.orderId)).size;
  const approvals = logs.filter(l => l.action === 'completed' && l.result?.decision === 'approved').length;
  const denials = logs.filter(l => l.action === 'completed' && l.result?.decision === 'denied').length;
  const escalations = logs.filter(l => l.action === 'completed' && l.result?.decision === 'escalated').length;
  const fraudCases = logs.filter(l => l.details?.fraudFlag || l.result?.fraudFlag).length;
  const avgProcessingTime = logs.length > 0 
    ? Math.round(logs.reduce((sum, l) => sum + (l.latency || 0), 0) / logs.length)
    : 0;

  return res.status(200).json({
    total_requests: totalRequests,
    approvals,
    denials,
    escalations,
    fraud_cases: fraudCases,
    avg_processing_time: avgProcessingTime,
  });
}
