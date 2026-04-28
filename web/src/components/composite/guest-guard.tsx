import type { ReactNode } from 'react';

import { useAuth } from '@/components/providers/auth-provider';

import { PageLoader } from '@/components/composite/page-loader';
import { Navigate } from 'react-router';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <PageLoader />;

    if (user) return <Navigate to="/overview" replace />;

    return <>{children}</>;
};
