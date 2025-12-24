import { useState, useCallback } from 'react';
import { ScenarioResult, ScenarioHookResult, LogType } from '../types';

const API_URL = 'http://localhost:3001/api';
const DEFAULT_TENANT_ID = 'default-tenant';

export const useTrafficSpike = (): ScenarioHookResult => {
  const [scenario, setScenario] = useState<ScenarioResult>({
    name: 'Traffic Spike',
    status: 'idle',
    logs: [],
  });

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const emoji = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }[type];

    setScenario(prev => ({
      ...prev,
      logs: [...prev.logs, `${emoji} ${message}`],
    }));
  }, []);

  const run = useCallback(async () => {
    setScenario(prev => ({ ...prev, status: 'running', logs: [] }));
    addLog('Starting traffic spike simulation (1000 requests)...', 'info');

    try {
      const requests = Array(1000).fill(null).map(() =>
        fetch(`${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`, {
          headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
        })
          .then(res => ({ status: res.status, success: res.ok }))
          .catch(() => ({ status: 0, success: false }))
      );

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const duration = Date.now() - startTime;

      const successful = results.filter(r => r.success).length;
      const rateLimited = results.filter(r => r.status === 429).length;
      const errors = results.filter(r => !r.success && r.status !== 429).length;

      addLog(`Completed 1000 requests in ${duration}ms`, 'success');
      addLog(`Successful: ${successful} (${(successful / 1000 * 100).toFixed(1)}%)`, 'success');
      addLog(`Rate limited: ${rateLimited} (${(rateLimited / 1000 * 100).toFixed(1)}%)`, 'warning');
      addLog(`Errors: ${errors} (${(errors / 1000 * 100).toFixed(1)}%)`, errors > 0 ? 'error' : 'success');
      addLog(`Throughput: ${(1000 / (duration / 1000)).toFixed(1)} req/s`, 'info');

      setScenario(prev => ({
        ...prev,
        status: 'success',
        metrics: {
          totalRequests: 1000,
          successful,
          rateLimited,
          errors,
          duration,
          throughput: 1000 / (duration / 1000),
        },
      }));

      if (rateLimited > 0) {
        addLog('Rate limiting working as expected!', 'success');
      }
    } catch (error) {
      addLog(`Error: ${(error as Error).message}`, 'error');
      setScenario(prev => ({ ...prev, status: 'error' }));
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setScenario({
      name: 'Traffic Spike',
      status: 'idle',
      logs: [],
    });
  }, []);

  return { scenario, run, reset };
};

