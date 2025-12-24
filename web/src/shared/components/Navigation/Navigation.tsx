import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Group, Button, Container, Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartBar, IconRocket, IconActivity } from '@tabler/icons-react';
import classes from './Navigation.module.scss';

export const Navigation = () => {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Button
        component={Link}
        to="/"
        variant={isActive('/') ? 'filled' : 'subtle'}
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
    </>
  );

  return (
    <nav className={classes.navigation}>
      <Container size="xl">
        <Group justify="space-between" className={classes.navGroup}>
          <Group gap="xs" className={classes.logo}>
            <IconActivity size={32} color="var(--mantine-color-blue-6)" />
            <span className={classes.logoText}>Analytics Platform</span>
          </Group>

          <Group gap="sm" className={classes.desktopNav}>
            <NavLinks />
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

