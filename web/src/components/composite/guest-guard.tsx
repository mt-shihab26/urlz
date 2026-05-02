import type { ReactNode } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { route } from '@/routes';
import { Navigate } from 'react-router';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (user) return <Navigate to={route.overviewIndex()} replace />;

    return <>{children}</>;
};
