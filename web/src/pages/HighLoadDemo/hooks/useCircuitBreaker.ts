import { useState, useCallback } from 'react';
import { ScenarioResult, ScenarioHookResult, LogType } from '../types';

const API_URL = 'http://localhost:3001/api';
const DEFAULT_TENANT_ID = 'default-tenant';

export const useCircuitBreaker = (): ScenarioHookResult => {
  const [scenario, setScenario] = useState<ScenarioResult>({
    name: 'Circuit Breaker',
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
    addLog('Testing circuit breaker with simulated failures...', 'info');

    try {
      // Simulate multiple requests that might trigger circuit breaker
      for (let i = 0; i < 10; i++) {
        addLog(`Attempt ${i + 1}: Making request...`, 'info');
        
        try {
          const response = await fetch(`${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`, {
            headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
          });
          if (response.ok) {
            addLog(`Attempt ${i + 1}: Success`, 'success');
          } else if (response.status === 503) {
            addLog(`Attempt ${i + 1}: Circuit OPEN (503)`, 'warning');
          } else {
            addLog(`Attempt ${i + 1}: Failed (${response.status})`, 'error');
          }
        } catch (err) {
          addLog(`Attempt ${i + 1}: Error`, 'error');
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setScenario(prev => ({ ...prev, status: 'success' }));
      addLog('Circuit breaker test completed!', 'success');
    } catch (error) {
      addLog(`Error: ${(error as Error).message}`, 'error');
      setScenario(prev => ({ ...prev, status: 'error' }));
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setScenario({
      name: 'Circuit Breaker',
      status: 'idle',
      logs: [],
    });
  }, []);

  return { scenario, run, reset };
};

