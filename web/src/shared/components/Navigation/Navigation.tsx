import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Group, Button, Container, Burger, Drawer, Menu, Avatar, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartBar, IconRocket, IconActivity, IconLogout, IconUserCircle, IconSwitchHorizontal, IconFlame, IconChartLine, IconBolt } from '@tabler/icons-react';
import { useAuthStore } from '@/store/authStore';
import classes from './Navigation.module.scss';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { currentUser, isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    close();
  };

  const handleSwitchUser = () => {
    navigate('/login');
    close();
  };

  const NavLinks = () => (
    <>
      <Button
        component={Link}
        to="/dashboard"
        variant={isActive('/dashboard') || isActive('/') ? 'filled' : 'subtle'}
        leftSection={<IconChartBar size={20} />}
        className={classes.navButton}
        onClick={close}
      >
        Dashboard
      </Button>
      <Button
        component={Link}
        to="/events"
        variant={isActive('/events') ? 'filled' : 'subtle'}
        leftSection={<IconRocket size={20} />}
        className={classes.navButton}
        onClick={close}
      >
        Event Generator
      </Button>
      <Button
        component={Link}
        to="/high-load-demo"
        variant={isActive('/high-load-demo') ? 'filled' : 'subtle'}
        leftSection={<IconFlame size={20} />}
        className={classes.navButton}
        onClick={close}
      >
        High Load Demo
      </Button>
      <Button
        component={Link}
        to="/event-log"
        variant={isActive('/event-log') ? 'filled' : 'subtle'}
        leftSection={<IconChartLine size={20} />}
        className={classes.navButton}
        onClick={close}
      >
        Event Log
      </Button>
      <Button
        component={Link}
        to="/real-time-stream"
        variant={isActive('/real-time-stream') ? 'filled' : 'subtle'}
        leftSection={<IconBolt size={20} />}
        className={classes.navButton}
        onClick={close}
      >
        Real-Time Stream
      </Button>
    </>
  );

  return (
    <nav className={classes.navigation}>
      <Container size="xl">
        <Group justify="space-between" className={classes.navGroup}>
          <Group
            gap="xs"
            className={classes.logo}
            component={Link}
            to="/dashboard"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <IconActivity size={32} color="var(--mantine-color-blue-6)" />
            <span className={classes.logoText}>Analytics Platform</span>
          </Group>

          <Group gap="sm" className={classes.desktopNav}>
            <NavLinks />
            {isAuthenticated && currentUser && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="subtle" leftSection={<IconUserCircle size={18} />}>
                    {currentUser.email.split('@')[0]}
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="xs" fw={500}>
                      {currentUser.email}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {currentUser.role}
                    </Text>
                  </Menu.Label>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconSwitchHorizontal size={16} />}
                    onClick={handleSwitchUser}
                  >
                    Switch User
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            aria-label="Toggle navigation"
          />
        </Group>
      </Container>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="sm"
        padding="md"
        className={classes.drawer}
      >
        <div className={classes.drawerContent}>
          <NavLinks />
        </div>
      </Drawer>
    </nav>
  );
};

