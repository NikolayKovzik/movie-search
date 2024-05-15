'use client';

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function AppWrapper({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Navbar p="md" style={{ position: 'absolute', backgroundColor: 'yellow' }}>
        Navbar
      </AppShell.Navbar>

      <AppShell.Main>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
