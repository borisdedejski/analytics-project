import { useState, useCallback } from 'react';
import { ScenarioResult, ScenarioHookResult, LogType } from '../types';

const API_URL = 'http://localhost:3001/api';
const DEFAULT_TENANT_ID = 'default-tenant';

export const useCachePerformance = (): ScenarioHookResult => {
  const [scenario, setScenario] = useState<ScenarioResult>({
    name: 'Cache Performance',
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
    addLog('Testing cache performance...', 'info');

    try {
      addLog('Test 1: Cache Miss (first request)', 'info');
      const miss1Start = Date.now();
      await fetch(`${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      const miss1Duration = Date.now() - miss1Start;
      addLog(`Duration: ${miss1Duration}ms`, 'info');

      // Second request (cache hit)
      addLog('Test 2: Cache Hit (repeated request)', 'info');
      const hit1Start = Date.now();
      await fetch(`${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      const hit1Duration = Date.now() - hit1Start;
      addLog(`Duration: ${hit1Duration}ms`, 'info');

      const speedup = ((miss1Duration - hit1Duration) / miss1Duration * 100).toFixed(1);
      addLog(`Cache speedup: ${speedup}% faster`, 'success');

      // Get cache stats
      const statsResponse = await fetch(`${API_URL}/analytics/cache/stats`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        addLog(`Cache hit rate: ${stats.cache?.hitRate?.toFixed(2)}%`, 'success');
        
        setScenario(prev => ({
          ...prev,
          status: 'success',
          metrics: { hitRate: stats.cache?.hitRate },
        }));
      }

      addLog('Cache performance test completed!', 'success');
    } catch (error) {
      addLog(`Error: ${(error as Error).message}`, 'error');
      setScenario(prev => ({ ...prev, status: 'error' }));
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setScenario({
      name: 'Cache Performance',
      status: 'idle',
      logs: [],
    });
  }, []);

  return { scenario, run, reset };
};

