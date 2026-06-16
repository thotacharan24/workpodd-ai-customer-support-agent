import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">AI Customer Support Refund Agent</h1>
        <p className="mb-6">Request refunds via AI-guided policy checks and review decisions in the admin dashboard.</p>
        <div className="flex gap-3">
          <Link href="/chat" className="px-4 py-2 bg-brand-500 rounded">Customer Chat</Link>
          <Link href="/admin" className="px-4 py-2 border rounded">Admin Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
