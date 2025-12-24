import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Alert,
  Avatar,
  Loader,
  Center,
} from '@mantine/core';
import { IconLogin, IconUserCircle, IconAlertCircle, IconMail, IconKey } from '@tabler/icons-react';
import { usersApi } from '@/shared/api/users';
import { useAuthStore } from '@/store/authStore';
import classes from './Login.module.scss';

export const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.login({ email, password });
      
      login(response.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      
      if (errorMessage.includes('User not found')) {
        setError('No user found with this email address');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ marginTop: '10vh' }}>
      <Paper className={classes.paper} shadow="md" p={40} radius="md" withBorder>
        <form onSubmit={handleLogin}>
          <Stack gap="md">
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={80}
                radius={80}
                mx="auto"
                mb="md"
                color="blue"
                variant="light"
              >
                <IconUserCircle size={50} />
              </Avatar>
              <Title order={2} mb="xs">
                Welcome to Analytics
              </Title>
              <Text size="sm" c="dimmed">
                Enter your email to continue
              </Text>
            </div>

            {error && (
              <Alert icon={<IconAlertCircle />} title="Login Failed" color="red">
                {error}
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              leftSection={<IconMail size={18} />}
              size="md"
              required
              type="email"
              disabled={isLoading}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter any password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              leftSection={<IconKey size={18} />}
              size="md"
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              leftSection={isLoading ? <Loader size={18} /> : <IconLogin size={18} />}
              disabled={isLoading || !email || !password}
              loading={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <Alert variant="light" color="blue" style={{ marginTop: '1rem' }}>
              <Text size="xs" c="dimmed">
                💡 <strong>Demo Mode:</strong> Any password will work! Just enter your
                registered email address.
              </Text>
            </Alert>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
