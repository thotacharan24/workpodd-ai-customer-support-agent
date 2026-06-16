"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TopNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import {
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-emerald-600/20 rounded-full blur-3xl opacity-30" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl"
        >
          {/* Hero Badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2">
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-100">
                Powered by LangGraph & AI Reasoning
              </span>
            </div>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            variants={itemVariants}
            className="text-center text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            <span className="text-gradient">
              AI Customer Support Agent
            </span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xl text-slate-300 max-w-2xl mx-auto mb-8"
          >
            Automated refund processing powered by LangGraph, AI decisioning, and
            strict policy enforcement. Every decision is traceable, explainable, and
            audit-ready.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
                <MessageSquare size={20} />
                Open Customer Chat
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
                <TrendingUp size={20} />
                View Admin Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-4 gap-4"
          >
            {[
              { icon: CheckCircle, label: "Approval", desc: "Fast approval flow" },
              { icon: AlertCircle, label: "Denial", desc: "Risk mitigation" },
              { icon: Shield, label: "Escalation", desc: "Premium review" },
              { icon: TrendingUp, label: "Analytics", desc: "Real-time insights" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-4 text-center"
              >
                <feature.icon size={24} className="mx-auto text-blue-400 mb-3" />
                <h3 className="font-semibold text-white">{feature.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* KPI Cards Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-slate-900/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Real-Time Operations Dashboard
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Monitor refund requests, track approvals, detect fraud, and ensure
              compliance with every decision
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-6 mb-12"
          >
            <MetricCard
              label="Total Requests"
              value="1,247"
              icon={MessageSquare}
              trend={{ value: 12, isPositive: true }}
              variant="primary"
            />
            <MetricCard
              label="Approvals"
              value="842"
              icon={CheckCircle}
              trend={{ value: 8, isPositive: true }}
              variant="success"
            />
            <MetricCard
              label="Denials"
              value="288"
              icon={AlertCircle}
              trend={{ value: 15, isPositive: false }}
              variant="danger"
            />
            <MetricCard
              label="Fraud Cases"
              value="117"
              icon={Shield}
              trend={{ value: 3, isPositive: false }}
              variant="warning"
            />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                title: "Intelligent Policy Engine",
                desc: "Advanced rule-based decision making with custom policy enforcement",
                features: [
                  "Refund window validation",
                  "Fraud score analysis",
                  "Loyalty tier detection",
                ],
              },
              {
                title: "Complete Reasoning Trace",
                desc: "Every decision is logged with full context for audit compliance",
                features: [
                  "Tool call tracking",
                  "Latency metrics",
                  "Step-by-step reasoning",
                ],
              },
              {
                title: "AI-Powered Explanations",
                desc: "OpenAI integration for natural language decision summaries",
                features: [
                  "Policy citations",
                  "Confidence scoring",
                  "Fallback reasoning",
                ],
              },
              {
                title: "Enterprise Dashboard",
                desc: "Professional observability UI for operations teams",
                features: [
                  "Real-time timeline",
                  "Analytics charts",
                  "Decision history",
                ],
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-8"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-300 mb-4">{card.desc}</p>
                <ul className="space-y-2">
                  {card.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-center gap-2 text-slate-300"
                    >
                      <CheckCircle size={16} className="text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-slate-800">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to experience intelligent refund processing?
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                Start Demo Chat
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-lg font-semibold">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
