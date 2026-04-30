import type { ReactNode } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { Navigate } from 'react-router';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (user) return <Navigate to="/overview" replace />;

    return <>{children}</>;
};
