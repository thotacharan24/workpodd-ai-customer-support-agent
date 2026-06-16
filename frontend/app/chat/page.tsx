"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { RefundDecision } from "@/types";
import { postRefund, postChat } from "@/lib/api";
import { TopNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { DecisionCard } from "@/components/ui/decision-card";
import { Timeline } from "@/components/ui/timeline";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Send, Copy, Check } from "lucide-react";

const sampleScenarios = [
  {
    label: "✓ Approved (Recent)",
    orderId: "ORD-APPROVED-001",
    desc: "Valid refund within window",
  },
  {
    label: "✗ Denied (Digital)",
    orderId: "ORD-DENIED-DIGITAL-001",
    desc: "Digital product policy",
  },
  {
    label: "✗ Denied (Fraud)",
    orderId: "ORD-DENIED-FRAUD-001",
    desc: "High fraud score",
  },
  {
    label: "✓ Approved (Defective)",
    orderId: "ORD-DEFECTIVE-001",
    desc: "Defective product exception",
  },
];

export default function ChatPage() {
  const [orderId, setOrderId] = useState("ORD-APPROVED-001");
  const [customerId, setCustomerId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useMutation<RefundDecision, Error, Record<string, any>>({
    mutationFn: (payload) => postRefund(payload),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: JSON.stringify(data, null, 2),
        },
      ]);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // If messageText provided, treat as free chat to /chat
    if (messageText.trim() && customerId.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `${customerId}: ${messageText}` },
      ]);
      mutation.mutateAsync = undefined; // keep types happy
      postChat({ customer_id: customerId.trim(), message: messageText.trim() })
        .then((data) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: JSON.stringify(data, null, 2) },
          ]);
        })
        .catch((err) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Error: ${err.message}` },
          ]);
        });
      return;
    }

    if (!orderId.trim()) return;

    // Add user message (order-based refund)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Process refund for order: ${orderId}` },
    ]);

    // Call API
    mutation.mutate({ orderId });
  }

  const latestDecision = messages.length > 0 && messages[messages.length - 1]?.role === "assistant"
    ? JSON.parse(messages[messages.length - 1].content)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main Chat Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card flex flex-col h-[600px]"
          >
            {/* Chat Header */}
            <div className="border-b border-slate-700/50 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Refund Request Assistant
              </h2>
              <p className="text-sm text-slate-400">
                Powered by LangGraph AI Agent
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-slate-400 mb-2">
                      Select a scenario or enter an order ID to begin
                    </p>
                    <p className="text-xs text-slate-500">
                      The AI agent will analyze policy and make a decision
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <ChatBubble
                      key={idx}
                      message={
                        msg.role === "user"
                          ? msg.content
                          : "Processing request..."
                      }
                      isUser={msg.role === "user"}
                    />
                  ))}
                  {mutation.isPending && (
                    <ChatBubble
                      message=""
                      isUser={false}
                      isLoading={true}
                    />
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700/50 p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter order ID (e.g., ORD-APPROVED-001)..."
                      disabled={mutation.isPending}
                      className="w-full bg-slate-900/50 border-slate-600 text-white placeholder-slate-500"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="Customer ID (for chat)"
                        className="w-1/3 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500"
                      />
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Optional: enter free-form chat message"
                        className="w-2/3 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                <Button
                  type="submit"
                    disabled={mutation.isPending || (!orderId.trim() && !(customerId.trim() && messageText.trim()))}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Scenarios */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <p className="label mb-4">Quick Scenarios</p>
              <div className="space-y-2">
                {sampleScenarios.map((scenario) => (
                  <button
                    key={scenario.orderId}
                    onClick={() => setOrderId(scenario.orderId)}
                    className="w-full text-left glass-card p-3 hover:border-blue-500/50 transition-colors"
                  >
                    <p className="font-semibold text-white text-sm">
                      {scenario.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {scenario.desc}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Decision Display */}
            {latestDecision && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <DecisionCard
                  decision={latestDecision.decision}
                  reason={latestDecision.explanation || "No reason provided"}
                  policyApplied={[]}
                />

                {latestDecision.explanation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-4"
                  >
                    <p className="label mb-2">AI Explanation</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {latestDecision.explanation}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          latestDecision.explanation
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="mt-3 flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        {latestDecision && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Timeline
              steps={latestDecision.steps?.map((step, idx) => ({
                id: String(idx + 1),
                label: step.step,
                status: "completed",
                detail: step.detail,
                latency: 0,
              })) || []}
            />
              ]}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
