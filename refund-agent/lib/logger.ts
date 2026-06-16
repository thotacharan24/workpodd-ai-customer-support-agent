export type LogStatus = "pending" | "success" | "failure";

export type LogEntry = {
  id: string;
  timestamp: string;
  node: string;
  tool: string;
  action: string;
  status: LogStatus;
  latency: number;
  orderId?: string;
  customerId?: string;
  result?: any;
  details?: any;
};

const logs: LogEntry[] = [];

export function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  const record: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  logs.unshift(record);
  if (logs.length > 500) logs.pop();
  return record;
}

export async function timedLog<T>(entry: Omit<LogEntry, 'id' | 'timestamp' | 'status' | 'latency' | 'result'>, fn: () => Promise<T>) {
  const start = Date.now();
  try {
    const result = await fn();
    addLog({
      ...entry,
      status: 'success',
      latency: Date.now() - start,
      result,
    });
    return result;
  } catch (error: any) {
    addLog({
      ...entry,
      status: 'failure',
      latency: Date.now() - start,
      details: {
        error: error?.message ?? String(error),
      },
    });
    throw error;
  }
}

export function getLogs() {
  return logs;
}
