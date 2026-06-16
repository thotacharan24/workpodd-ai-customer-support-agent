"use client";

import { useEffect, useRef, useState } from 'react';

type ChatEntry = {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  meta?: string;
  time: string;
};

function createId() {
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatPage() {
  const [message, setMessage] = useState('I want a refund for order ORD-001');
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [supportRecognition, setSupportRecognition] = useState(false);
  const [supportSpeech, setSupportSpeech] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupportRecognition(Boolean(SpeechRecognition));
    setSupportSpeech('speechSynthesis' in window);

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      setMessage(finalText || interimText);

      if (finalText) {
        setHistory((prev) => [
          ...prev,
          {
            id: createId(),
            speaker: 'user',
            text: finalText,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setIsListening(false);
        recognition.stop();
        send(finalText);
      }
    };

    recognition.onerror = (event: any) => {
      setError(event.error || 'Speech recognition failed.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !supportSpeech || !speechEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setError(null);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const send = async (overrideMessage?: string) => {
    const text = overrideMessage ?? message.trim();
    if (!text) {
      setError('Please enter a message or use voice input.');
      return;
    }

    setLoading(true);
    setError(null);

    const userEntry: ChatEntry = {
      id: createId(),
      speaker: 'user',
      text,
      time: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [...prev, userEntry]);

      try {
      // Call backend /refund endpoint directly
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000';
      const orderMatch = text.match(/(ORD-[A-Z0-9-]+)/i);
      const orderId = orderMatch ? orderMatch[1] : 'ORD-APPROVED-001';

      const res = await fetch(`${API_URL}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to process the request.');
        setLoading(false);
        return;
      }

      const decision = data.decision || data.evaluation?.decision || 'denied';
      const explanation = data.explanation || data.evaluation?.explanation || '';
      const steps = data.steps || data.evaluation?.steps || [];

      const assistantText = `${decision.toUpperCase()}: ${explanation}`;
      const assistantEntry: ChatEntry = {
        id: createId(),
        speaker: 'assistant',
        text: assistantText,
        meta: decision,
        time: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [...prev, assistantEntry]);
      setLastResponse(assistantText);
      if (speechEnabled) speakText(assistantText);
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'Unexpected error sending message.');
    } finally {
      setLoading(false);
    }
  };

  const replayLastResponse = () => {
    if (lastResponse) {
      speakText(lastResponse);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">AI Refund Assistant</h1>
              <p className="mt-2 text-slate-400">Talk to the refund workflow with voice recognition, live transcript, and policy-aware decisions.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Speech input: {supportRecognition ? 'Enabled' : 'Unsupported'}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Speech output: {supportSpeech ? 'Enabled' : 'Unsupported'}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1.5fr_0.7fr]">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-300" htmlFor="chat-input">Ask the assistant</label>
              <textarea
                id="chat-input"
                className="min-h-[140px] w-full resize-none rounded-3xl border border-slate-700 bg-slate-950 p-4 text-slate-100 outline-none focus:border-brand-500"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="I want a refund for order ORD-001"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => send()}
                    disabled={loading}
                  >
                    {loading ? 'Processing…' : 'Send Request'}
                  </button>
                  <button
                    className="rounded-full border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-500"
                    onClick={toggleListening}
                    type="button"
                  >
                    {isListening ? 'Stop Listening' : 'Start Voice Input'}
                  </button>
                  <button
                    className="rounded-full border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-500"
                    onClick={() => setSpeechEnabled((value) => !value)}
                    type="button"
                  >
                    {speechEnabled ? 'Mute Speech' : 'Enable Speech'}
                  </button>
                </div>
                <button
                  className="rounded-full border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-500"
                  onClick={replayLastResponse}
                  type="button"
                  disabled={!lastResponse || !supportSpeech}
                >
                  Replay Last Response
                </button>
              </div>

              {error ? <div className="rounded-3xl border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
              {isListening ? <div className="rounded-3xl border border-amber-500 bg-amber-500/10 p-4 text-sm text-amber-200">Listening... speak your refund request now.</div> : null}
              {history.length > 0 && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <h2 className="text-base font-semibold text-slate-200">Conversation</h2>
                  <div className="mt-4 space-y-3">
                    {history.map((entry) => (
                      <div key={entry.id} className={`rounded-3xl p-4 ${entry.speaker === 'assistant' ? 'bg-slate-900' : 'bg-slate-800'}`}>
                        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                          <span>{entry.speaker === 'assistant' ? 'Agent' : 'You'}</span>
                          <span>{entry.time}</span>
                        </div>
                        <p className="mt-2 text-slate-100 whitespace-pre-wrap">{entry.text}</p>
                        {entry.meta ? <p className="mt-2 text-xs text-slate-400">Decision: {entry.meta}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <h2 className="text-lg font-semibold text-slate-100">Agent status</h2>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="grid gap-2 sm:grid-cols-2">
                  <span className="rounded-2xl bg-slate-900 px-3 py-2">Microphone: {supportRecognition ? 'Available' : 'Unavailable'}</span>
                  <span className="rounded-2xl bg-slate-900 px-3 py-2">Speech synthesis: {supportSpeech ? 'Available' : 'Unavailable'}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <span className="rounded-2xl bg-slate-900 px-3 py-2">Voice mode: {isListening ? 'Listening' : 'Idle'}</span>
                  <span className="rounded-2xl bg-slate-900 px-3 py-2">Speech output: {isSpeaking ? 'Speaking' : speechEnabled ? 'Enabled' : 'Muted'}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm text-slate-300">Last response</p>
                <p className="mt-3 text-slate-100 whitespace-pre-wrap">{lastResponse || 'No response yet. Send a request to see policy-aware reasoning.'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
