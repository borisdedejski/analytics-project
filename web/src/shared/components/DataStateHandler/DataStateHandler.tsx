import { ReactNode } from 'react';
import { Container, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import classes from './DataStateHandler.module.scss';

interface DataStateHandlerProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
  errorMessage?: string;
  errorTitle?: string;
}

export const DataStateHandler = ({
  isLoading,
  error,
  children,
  errorMessage = 'Failed to load analytics data. Please try again later.',
  errorTitle = 'Error',
}: DataStateHandlerProps) => {
  if (isLoading) {
    return (
      <div className={classes.loading}>
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Alert icon={<IconAlertCircle />} title={errorTitle} color="red" className={classes.error}>
          {errorMessage}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
};

