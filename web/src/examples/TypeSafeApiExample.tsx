/**
 * Example: Using Generated Types with Runtime Validation
 * 
 * This example demonstrates how to use auto-generated backend types
 * with Zod validation in your React components.
 */

import { useState } from 'react';
import type { 
  AnalyticsSummaryDto, 
  CreateEventDto,
  EventResponseDto 
} from '../types/generated';
import { 
  AnalyticsSummaryDtoSchema,
  CreateEventDtoSchema,
  EventResponseDtoSchema 
} from '../types/generated';

// Example 1: Fetching data with validation
export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/tenant-123?startDate=2024-01-01&endDate=2024-12-31');
      const data = await response.json();

      // Runtime validation - will throw if backend response doesn't match schema
      const validated = AnalyticsSummaryDtoSchema.parse(data);
      
      setAnalytics(validated);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Validation failed: ${err.message}`);
      }
      console.error('Failed to fetch analytics:', err);
    }
  };

  return (
    <div>
      <button onClick={fetchAnalytics}>Fetch Analytics</button>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {analytics && (
        <div>
          <h2>Analytics Summary</h2>
          <p>Total Events: {analytics.totalEvents}</p>
          <p>Unique Users: {analytics.uniqueUsers}</p>
          
          <h3>Events by Type</h3>
          <ul>
            {analytics.eventsByType.map((event) => (
              <li key={event.eventType}>
                {event.eventType}: {event.count}
              </li>
            ))}
          </ul>

          <h3>Device Stats</h3>
          <ul>
            {analytics.deviceStats.map((stat) => (
              <li key={stat.device}>
                {stat.device}: {stat.count} ({stat.percentage.toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 2: Sending data with validation
export function EventCreator() {
  const [result, setResult] = useState<EventResponseDto | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createEvent = async () => {
    try {
      const eventData: CreateEventDto = {
        eventType: 'button_click',
        userId: 'user-123',
        sessionId: 'session-456',
        page: '/dashboard',
        device: 'desktop',
        metadata: {
          buttonId: 'submit-button',
          feature: 'analytics',
        },
      };

      // Validate input before sending
      const validated = CreateEventDtoSchema.parse(eventData);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      const responseData = await response.json();

      // Validate response
      const validatedResponse = EventResponseDtoSchema.parse(responseData);
      
      setResult(validatedResponse);
      setValidationError(null);
    } catch (err) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
      console.error('Failed to create event:', err);
    }
  };

  return (
    <div>
      <button onClick={createEvent}>Create Event</button>
      
      {validationError && (
        <div style={{ color: 'red' }}>
          Validation Error: {validationError}
        </div>
      )}
      
      {result && (
        <div style={{ color: 'green' }}>
          Event created successfully: {result.id}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// Example 3: Safe parsing (doesn't throw)
export function SafeAnalyticsFetch() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<AnalyticsSummaryDto | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchWithSafeParse = async () => {
    setStatus('loading');
    
    try {
      const response = await fetch('/api/analytics/tenant-123?startDate=2024-01-01&endDate=2024-12-31');
      const rawData = await response.json();

      // Safe parse - returns { success: boolean, data?: T, error?: ZodError }
      const result = AnalyticsSummaryDtoSchema.safeParse(rawData);
      
      if (result.success) {
        setData(result.data);
        setStatus('success');
        setErrors([]);
      } else {
        setStatus('error');
        setErrors(result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`));
      }
    } catch (err) {
      setStatus('error');
      setErrors([err instanceof Error ? err.message : 'Unknown error']);
    }
  };

  return (
    <div>
      <button onClick={fetchWithSafeParse} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading...' : 'Fetch Analytics (Safe)'}
      </button>
      
      {status === 'error' && (
        <div style={{ color: 'red' }}>
          <h3>Validation Errors:</h3>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {status === 'success' && data && (
        <div style={{ color: 'green' }}>
          <h3>Data Valid ✓</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// Example 4: Using Prisma-generated types
import { TenantSchema, EventSchema as PrismaEventSchema } from '../types/generated/prisma';

export function PrismaTypesExample() {
  // You can use Prisma-generated schemas for database models
  const validateTenant = (data: unknown) => {
    const result = TenantSchema.safeParse(data);
    
    if (result.success) {
      // result.data is now typed as Tenant from Prisma
      console.log('Valid tenant:', result.data);
      return result.data;
    } else {
      console.error('Invalid tenant:', result.error);
      return null;
    }
  };

  return (
    <div>
      <h3>Prisma Types Available</h3>
      <p>All Prisma models have auto-generated Zod schemas</p>
      <ul>
        <li>TenantSchema</li>
        <li>UserSchema</li>
        <li>EventSchema</li>
        <li>MetricSchema</li>
      </ul>
    </div>
  );
}

