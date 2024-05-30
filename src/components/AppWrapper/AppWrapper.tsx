'use client';

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        <Link href="/movies/page/1">Movies</Link>
        <Link href="/rated-movies/1">Rated Movies</Link>
      </AppShell.Navbar>

      <AppShell.Main>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AppWrapper;
