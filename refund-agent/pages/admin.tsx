import { useEffect, useState } from 'react';

type LogEntry = {
  id: string;
  timestamp: string;
  node: string;
  tool: string;
  action: string;
  status: string;
  latency: number;
  orderId?: string;
  customerId?: string;
  result?: any;
  details?: any;
};

const summarizeLatency = (logs: LogEntry[] = []) => {
  if (!logs.length) return 0;
  return Math.round(logs.reduce((sum, log) => sum + log.latency, 0) / logs.length);
};

export default function Admin() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000';
        const [logsRes, customersRes] = await Promise.all([
          fetch(`${API_URL}/logs`),
          fetch(`${API_URL}/customers`),
        ]);

        if (!mounted) return;

        const logsJson = await logsRes.json();
        const customersJson = await customersRes.json();

        setLogs(logsJson);
        setCustomers(customersJson);
      } catch (error) {
        console.error('Observability fetch failed', error);
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 2000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const totalLogs = logs?.length ?? 0;
  const filteredLogs = logs?.filter((l) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (
      (l.orderId ?? '').toString().toLowerCase().includes(f) ||
      (l.customerId ?? '').toString().toLowerCase().includes(f) ||
      (l.tool ?? '').toString().toLowerCase().includes(f) ||
      (l.node ?? '').toString().toLowerCase().includes(f) ||
      (l.status ?? '').toString().toLowerCase().includes(f)
    );
  }) ?? [];
  const totalFiltered = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);
  const errorLogs = logs?.filter((log) => log.status === 'failure') ?? [];
  const decisionEvents = logs?.filter((log) => log.node === 'agent' && log.tool === 'state' && log.details?.state === 'Decision' && log.action === 'exit') ?? [];
  const recentPolicy = logs?.find((log) => log.tool === 'checkRefundPolicy' && log.status === 'success');
  const toolCalls = logs?.filter((log) => log.node === 'tool') ?? [];

  const latencyAverage = summarizeLatency(logs);
  const decisionCount = decisionEvents.length;

  const toolStats = toolCalls.reduce<Record<string, { count: number; totalLatency: number }>>((acc, entry) => {
    const current = acc[entry.tool] ?? { count: 0, totalLatency: 0 };
    acc[entry.tool] = { count: current.count + 1, totalLatency: current.totalLatency + entry.latency };
    return acc;
  }, {});

  const toolSummary = Object.entries(toolStats).map(([tool, stats]) => ({
    tool,
    count: stats.count,
    avgLatency: Math.round(stats.totalLatency / stats.count),
  }));

  const exportCsv = (logsToExport: LogEntry[]) => {
    if (!logsToExport || logsToExport.length === 0) return;
    const headers = ['id','timestamp','node','tool','action','status','latency','orderId','customerId','details'];
    const rows = logsToExport.map((l) => [
      l.id,
      l.timestamp,
      l.node,
      l.tool,
      l.action,
      l.status,
      String(l.latency ?? ''),
      l.orderId ?? '',
      l.customerId ?? '',
      JSON.stringify(l.details ?? ''),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reasoning-logs-${new Date().toISOString().slice(0,19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold">Refund Agent Observatory</h1>
          <p className="mt-2 text-slate-400">Live workflow monitoring, policy evaluation, tool latency, and audit-ready decision logs.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Customers</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{customers?.length ?? '...'}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total logs</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{totalLogs}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Decision events</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{decisionCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Avg latency</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{latencyAverage} ms</p>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-100">Policy and decision details</h2>
            {recentPolicy ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-slate-950 p-4 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">Latest evaluated order</p>
                  <p className="mt-2">Order ID: <strong>{recentPolicy.orderId ?? 'unknown'}</strong></p>
                  <p>Customer ID: <strong>{recentPolicy.customerId ?? 'unknown'}</strong></p>
                  <p>Outcome: <strong>{recentPolicy.result?.approved ? 'Allowed' : 'Denied'}</strong></p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-4 text-sm text-slate-300">
                    <p className="font-medium text-slate-100">Policy violations</p>
                    <pre className="mt-3 whitespace-pre-wrap text-slate-200">{(recentPolicy.result?.violated || []).join('\n') || 'None'}</pre>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-4 text-sm text-slate-300">
                    <p className="font-medium text-slate-100">Evaluation summary</p>
                    <p className="mt-3 text-slate-200">{recentPolicy.result?.reason || 'No summary available.'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl bg-slate-950 p-6 text-sm text-slate-400">No policy evaluation logs are available yet.</div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-100">Tool latency</h2>
            <div className="mt-5 space-y-3">
              {toolSummary.length > 0 ? (
                toolSummary.map((entry) => (
                  <div key={entry.tool} className="rounded-3xl bg-slate-950 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-100">{entry.tool}</span>
                      <span className="text-slate-400">{entry.count} calls</span>
                    </div>
                    <p className="mt-2 text-slate-200">Average latency: {entry.avgLatency} ms</p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-950 p-6 text-sm text-slate-400">Waiting for tool calls to populate.</div>
              )}
            </div>
          </section>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-100">Reasoning timeline</h2>
            <div className="mt-5 space-y-3">
              <div className="mb-4 flex items-center gap-3">
                <input
                  aria-label="filter"
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                  placeholder="Filter by order/customer/tool/status"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                />
                <button
                  onClick={() => exportCsv(filteredLogs)}
                  className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-100"
                >Export CSV</button>
              </div>
              {paginatedLogs.map((log) => (
                <div key={log.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <span>{log.node.toUpperCase()}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-2 text-slate-100">
                    <strong>{log.tool}</strong> · {log.action} · {log.status}
                  </p>
                  <p className="mt-2 text-slate-300">Order: {log.orderId ?? 'N/A'} · Customer: {log.customerId ?? 'N/A'}</p>
                  {log.details ? <pre className="mt-3 overflow-x-auto text-xs text-slate-400">{JSON.stringify(log.details, null, 2)}</pre> : null}
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">Showing {((page-1)*pageSize)+1}–{Math.min(page*pageSize, totalFiltered)} of {totalFiltered} logs</div>
                <div className="flex items-center gap-2">
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md bg-slate-900 px-2 py-1 text-sm">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <button onClick={() => setPage((p) => Math.max(1, p-1))} className="rounded-md bg-slate-800 px-3 py-1">Prev</button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} className="rounded-md bg-slate-800 px-3 py-1">Next</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold text-slate-100">Recent decisions</h2>
              <div className="mt-5 space-y-3">
                {decisionEvents.slice(0, 6).map((entry) => (
                  <div key={entry.id} className="rounded-3xl bg-slate-950 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-100">Order {entry.orderId ?? 'N/A'}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{entry.result?.approved ? 'Approved' : 'Denied'}</span>
                    </div>
                    <p className="mt-2 text-slate-400">Rules: {(entry.result?.violated || []).join(', ') || 'No violations'}</p>
                  </div>
                ))}
                {decisionEvents.length === 0 ? <p className="text-sm text-slate-500">No decision events recorded yet.</p> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold text-slate-100">Error events</h2>
              <div className="mt-5 space-y-3">
                {errorLogs.length > 0 ? (
                  errorLogs.slice(0, 6).map((entry) => (
                    <div key={entry.id} className="rounded-3xl bg-rose-950 p-4 text-sm text-rose-200">
                      <p className="font-medium text-rose-100">{entry.tool} · {entry.action}</p>
                      <p className="mt-2 text-slate-100">{entry.details?.error ?? 'Unknown error'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No errors detected.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
