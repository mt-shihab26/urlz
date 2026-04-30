import type { ReactNode } from 'react';

import { getAuth } from '@/lib/auth';

import { Navigate } from 'react-router';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const user = getAuth();

    if (!user) return <Navigate to="/sign-in" replace />;

    return <>{children}</>;
};
