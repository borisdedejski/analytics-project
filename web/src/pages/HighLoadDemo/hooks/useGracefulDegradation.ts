import { useState, useCallback } from 'react';
import { ScenarioResult, ScenarioHookResult, LogType } from '../types';

const API_URL = 'http://localhost:3001/api';
const DEFAULT_TENANT_ID = 'default-tenant';

export const useGracefulDegradation = (): ScenarioHookResult => {
  const [scenario, setScenario] = useState<ScenarioResult>({
    name: 'Graceful Degradation',
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
    addLog('Testing graceful degradation under load...', 'info');

    try {
      // Simulate load with different priorities
      const priorities = [1, 3, 5, 7, 9];
      
      for (const priority of priorities) {
        addLog(`Testing priority ${priority} request...`, 'info');
        
        const response = await fetch(
          `${API_URL}/analytics/summary?startDate=2025-01-01&endDate=2025-12-31&groupBy=day`,
          { 
            headers: { 
              'X-Priority': String(priority),
              'x-tenant-id': DEFAULT_TENANT_ID
            } 
          }
        );

        if (response.ok) {
          addLog(`Priority ${priority}: Accepted ✓`, 'success');
        } else if (response.status === 503) {
          addLog(`Priority ${priority}: Rejected (degraded)`, 'warning');
        }
      }

      setScenario(prev => ({ ...prev, status: 'success' }));
      addLog('Graceful degradation test completed!', 'success');
    } catch (error) {
      addLog(`Error: ${(error as Error).message}`, 'error');
      setScenario(prev => ({ ...prev, status: 'error' }));
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setScenario({
      name: 'Graceful Degradation',
      status: 'idle',
      logs: [],
    });
  }, []);

  return { scenario, run, reset };
};

