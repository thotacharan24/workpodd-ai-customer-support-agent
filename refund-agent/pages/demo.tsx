"use client";

import { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

type Result = { request_id: string; customer_id: string; decision: string; explanation: string; steps: any[] };

export default function Demo() {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const scenarios = [
    { id: 'approved', title: 'Approved Refund', customer: 'C001', desc: 'Recent purchase within 15 days.' },
    { id: 'denied', title: 'Denied Refund (policy)', customer: 'C010', desc: 'Request after 60 days.' },
    { id: 'fraud', title: 'Fraud Denied', customer: 'C015', desc: 'High fraud score (95).' },
  ];

  async function runScenario(customer_id: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id, message: 'Demo scenario' }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data as Result);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-semibold">Demo Scenarios</h1>
        <p className="text-slate-400">Run the three demo scenarios to verify outcomes: Approved, Denied (policy), Fraud Denied.</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {scenarios.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
                </div>
                <Badge>{s.customer}</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => runScenario(s.customer)}
                  disabled={loading}
                >
                  Run
                </button>
                <button
                  className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200"
                  onClick={() => { setResult(null); setError(null); }}
                >
                  Clear
                </button>
              </div>
            </Card>
          ))}
        </div>

        <section>
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Scenario Output</h2>
              <div>{loading ? <Spinner /> : null}</div>
            </div>

            {error ? <div className="mt-4 rounded-md bg-rose-800/30 p-4 text-rose-200">Error: {error}</div> : null}

            {result ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Badge color={result.decision === 'approved' ? 'bg-emerald-600' : result.decision === 'denied' ? 'bg-rose-600' : 'bg-amber-600'}>{result.decision.toUpperCase()}</Badge>
                  <div>
                    <div className="text-sm text-slate-400">Request ID</div>
                    <div className="text-slate-100 font-mono text-sm">{result.request_id}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-200">Explanation</h3>
                  <p className="mt-2 text-slate-300">{result.explanation}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-200">Reasoning Steps</h3>
                  <div className="mt-2">
                    <Table columns={["step","detail","approved"]} rows={result.steps.map((s) => ({ step: s.step, detail: s.detail, approved: s.approved ? '✔' : '✖' }))} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-slate-400">No scenario run yet. Click "Run" on any card above.</div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
