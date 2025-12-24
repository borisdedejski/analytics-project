export interface ScenarioResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  metrics?: {
    totalRequests?: number;
    successful?: number;
    rateLimited?: number;
    errors?: number;
    duration?: number;
    throughput?: number;
    hitRate?: number;
    loadLevel?: string;
  };
  logs: string[];
}

export interface LoadMetrics {
  level: string;
  requestsPerSecond: number;
  errorRate: number;
  currentLoad: number;
}

export type LogType = 'info' | 'success' | 'error' | 'warning';

export interface ScenarioHookResult {
  scenario: ScenarioResult;
  run: () => Promise<void>;
  reset: () => void;
}

