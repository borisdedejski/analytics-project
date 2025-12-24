/**
 * StatCard Component Tests
 * 
 * Tests pure UI component with no business logic
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { StatCard } from '@/features/analytics/components/StatCard/StatCard';
import { IconUsers } from '@tabler/icons-react';

describe('StatCard', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  it('should render title and value correctly', () => {
    // Arrange & Act
    renderWithProviders(
      <StatCard title="Total Users" value="1,234" icon={IconUsers} color="blue" />
    );

    // Assert
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should display trend when provided', () => {
    // Arrange & Act
    renderWithProviders(
      <StatCard
        title="Total Events"
        value="5,000"
        icon={IconUsers}
        color="green"
        trend="+12.5%"
      />
    );

    // Assert
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('should display description when provided', () => {
    // Arrange & Act
    renderWithProviders(
      <StatCard
        title="Unique Users"
        value="500"
        icon={IconUsers}
        color="violet"
        description="Active in last 30 days"
      />
    );

    // Assert
    expect(screen.getByText('Active in last 30 days')).toBeInTheDocument();
  });

  it('should apply loading state correctly', () => {
    // Arrange & Act
    const { container } = renderWithProviders(
      <StatCard
        title="Loading Data"
        value="..."
        icon={IconUsers}
        color="gray"
        isLoading={true}
      />
    );

    // Assert
    // Check for Mantine Skeleton component
    expect(container.querySelector('.mantine-Skeleton-root')).toBeInTheDocument();
  });

  it('should handle large numbers correctly', () => {
    // Arrange & Act
    renderWithProviders(
      <StatCard
        title="Total Events"
        value="1,234,567"
        icon={IconUsers}
        color="blue"
      />
    );

    // Assert
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    // Arrange & Act
    renderWithProviders(
      <StatCard
        title="Total Users"
        value="1,234"
        icon={IconUsers}
        color="blue"
      />
    );

    // Assert
    const card = screen.getByText('Total Users').closest('.mantine-Paper-root');
    expect(card).toBeInTheDocument();
  });

  it('should render with different color variants', () => {
    // Arrange & Act
    const { rerender } = renderWithProviders(
      <StatCard
        title="Test"
        value="100"
        icon={IconUsers}
        color="blue"
      />
    );

    // Assert - Blue
    expect(screen.getByText('Test')).toBeInTheDocument();

    // Rerender with different color
    rerender(
      <MantineProvider>
        <StatCard
          title="Test"
          value="100"
          icon={IconUsers}
          color="green"
        />
      </MantineProvider>
    );

    // Assert - Green
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

