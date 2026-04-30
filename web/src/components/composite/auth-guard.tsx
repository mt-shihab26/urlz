import type { ReactNode } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { Navigate } from 'react-router';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/sign-in" replace />;

    return <>{children}</>;
};
