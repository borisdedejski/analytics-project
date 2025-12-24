import { useState, useCallback } from 'react';
import { ScenarioResult, ScenarioHookResult, LogType, LoadMetrics } from '../types';

const API_URL = 'http://localhost:3001/api';
const DEFAULT_TENANT_ID = 'default-tenant';

export const useIntegration = (onMetricsUpdate?: (metrics: LoadMetrics) => void): ScenarioHookResult => {
  const [scenario, setScenario] = useState<ScenarioResult>({
    name: 'E2E Integration',
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
    addLog('Running end-to-end integration test...', 'info');

    try {
      // Test 1: Normal request
      addLog('Test 1: Normal priority request', 'info');
      const response1 = await fetch(`${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      addLog(`Status: ${response1.status}`, response1.ok ? 'success' : 'error');

      if (response1.ok) {
        const data = await response1.json();
        addLog(`Has data: ${!!data.totalEvents}`, 'success');
      }

      // Test 2: Cache stats
      addLog('Test 2: Fetching cache statistics', 'info');
      const statsResponse = await fetch(`${API_URL}/analytics/cache/stats`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        addLog(`Cache hit rate: ${stats.cache?.hitRate?.toFixed(2)}%`, 'success');
        addLog(`Load level: ${stats.load?.level}`, 'info');
        
        if (onMetricsUpdate) {
          onMetricsUpdate({
            level: stats.load?.level || 'NORMAL',
            requestsPerSecond: stats.load?.requestsPerSecond || 0,
            errorRate: stats.load?.errorRate || 0,
            currentLoad: stats.load?.currentLoad || 0,
          });
        }
      }

      // Test 3: Health check
      addLog('Test 3: Health check', 'info');
      const healthResponse = await fetch(`${API_URL}/analytics/health`);
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        addLog(`System status: ${health.status}`, 'success');
      }

      setScenario(prev => ({ ...prev, status: 'success' }));
      addLog('End-to-end integration test completed!', 'success');
    } catch (error) {
      addLog(`Error: ${(error as Error).message}`, 'error');
      setScenario(prev => ({ ...prev, status: 'error' }));
    }
  }, [addLog, onMetricsUpdate]);

  const reset = useCallback(() => {
    setScenario({
      name: 'E2E Integration',
      status: 'idle',
      logs: [],
    });
  }, []);

  return { scenario, run, reset };
};

