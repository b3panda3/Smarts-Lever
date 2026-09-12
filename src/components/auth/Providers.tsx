'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import SessionSync from './SessionSync';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}
