'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Providers wrapper component for client-side session management
 */
export default function Providers({ children }: ProvidersProps) {
    return <SessionProvider>{children}</SessionProvider>;
}







