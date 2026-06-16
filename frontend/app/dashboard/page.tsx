"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchCustomers, fetchLogs, fetchMetrics } from "@/lib/api";
import { TopNav } from "@/components/ui/nav";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Activity,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

// Sample chart data
const approvalTrendData = [
  { date: "Mon", approvals: 65, denials: 28 },
  { date: "Tue", approvals: 78, denials: 22 },
  { date: "Wed", approvals: 72, denials: 25 },
  { date: "Thu", approvals: 85, denials: 18 },
  { date: "Fri", approvals: 92, denials: 14 },
  { date: "Sat", approvals: 68, denials: 26 },
];

const fraudDistribution = [
  { name: "Low Risk", value: 65 },
  { name: "Medium Risk", value: 20 },
  { name: "High Risk", value: 10 },
  { name: "Critical", value: 5 },
];

const processingTimeData = [
  { timeRange: "0-100ms", count: 145 },
  { timeRange: "100-200ms", count: 289 },
  { timeRange: "200-300ms", count: 156 },
  { timeRange: "300-500ms", count: 78 },
];

export default function DashboardPage() {
  const metricsQuery = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
    staleTime: 1000 * 60,
  });
  const logsQuery = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
    staleTime: 1000 * 60,
  });
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 1000 * 60,
  });

  const isLoading = metricsQuery.isLoading || logsQuery.isLoading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav />

      <div className="container-safe py-12">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold text-white mb-2"
          >
            Operations Dashboard
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-400">
            Real-time monitoring of refund requests, decisions, and compliance
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-4 inline-flex items-center gap-2 glass-card px-4 py-2"
          >
            <Activity size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">
              {metricsQuery.isLoading
                ? "Updating..."
                : "Connected"}
            </span>
          </motion.div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </>
          ) : (
            <>
              <MetricCard
                label="Total Requests"
                value={metricsQuery.data?.total_requests ?? 0}
                icon={TrendingUp}
                variant="primary"
              />
              <MetricCard
                label="Approvals"
                value={metricsQuery.data?.approvals ?? 0}
                icon={CheckCircle}
                variant="success"
              />
              <MetricCard
                label="Denials"
                value={metricsQuery.data?.denials ?? 0}
                icon={AlertCircle}
                variant="danger"
              />
              <MetricCard
                label="Fraud Cases"
                value={metricsQuery.data?.fraud_cases ?? 0}
                icon={Shield}
                variant="warning"
              />
              <MetricCard
                label="Avg Processing"
                value={(metricsQuery.data?.avg_processing_time ?? 0) + "ms"}
                icon={Clock}
                variant="primary"
              />
            </>
          )}
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-6 mb-12"
        >
          {/* Approval Trend Chart */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Approval Trends
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={approvalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="denials"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Fraud Risk Distribution */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Fraud Risk Distribution
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fraudDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fraudDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Processing Time Distribution */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Processing Time Distribution
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Decision Distribution */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Decision Distribution
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Approved",
                        value: metricsQuery.data?.approvals || 0,
                      },
                      { name: "Denied", value: metricsQuery.data?.denials || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>

        {/* Recent Activity & Customer Risk */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Recent Activity
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {logsQuery.data?.slice(0, 8).map((log: any) => (
                  <motion.div
                    key={log.id}
                    variants={itemVariants}
                    className="flex items-start justify-between p-4 rounded-lg bg-slate-800/20 border border-slate-700/30 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">
                        {log.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {log.detail}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={
                          log.approved
                            ? "success"
                            : log.step === "error"
                            ? "danger"
                            : "info"
                        }
                        label={log.approved ? "Pass" : "Review"}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Customer Risk Matrix */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              High-Risk Customers
            </h3>
            {isLoading ? (
              <LoadingSkeleton variant="avatar" count={3} />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {customersQuery.data
                  ?.filter((c: any) => c.fraud_flag || c.refund_count_last_90_days > 3)
                  .slice(0, 6)
                  .map((customer: any) => (
                    <motion.div
                      key={customer.id}
                      variants={itemVariants}
                      className="p-3 rounded-lg bg-slate-800/20 border border-slate-700/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">
                            {customer.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {customer.id}
                          </p>
                        </div>
                        <StatusBadge
                          status={customer.fraud_flag ? "danger" : "warning"}
                          label={
                            customer.fraud_flag ? "Fraud" : "Risk"
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
