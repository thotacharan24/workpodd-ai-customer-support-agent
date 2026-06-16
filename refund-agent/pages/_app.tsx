import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Header() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/chat">Customer Chat</Link>
          <Link href="/admin">Admin Dashboard</Link>
          <Link href="/demo">Demo Scenarios</Link>
        </nav>
        <div>
          <button className="rounded px-3 py-1 border" onClick={() => setDark((d) => !d)}>{dark ? 'Dark' : 'Light'}</button>
        </div>
      </div>
    </header>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
