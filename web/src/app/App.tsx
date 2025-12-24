import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { EventGenerator } from '@/pages/EventGenerator/EventGenerator';
import { HighLoadDemo } from '@/pages/HighLoadDemo/HighLoadDemo';
import { EventLog } from '@/pages/EventLog/EventLog';
import { RealTimeStream } from '@/pages/RealTimeStream/RealTimeStream';
import { Login } from '@/pages/Login/Login';
import { Navigation } from '@/shared/components/Navigation/Navigation';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme/theme';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0, // Data is always considered stale for real-time updates
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/high-load-demo"
              element={
                <ProtectedRoute>
                  <HighLoadDemo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-log"
              element={
                <ProtectedRoute>
                  <EventLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/real-time-stream"
              element={
                <ProtectedRoute>
                  <RealTimeStream />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
};

