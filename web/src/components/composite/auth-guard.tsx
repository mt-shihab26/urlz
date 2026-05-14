import type { ReactNode } from 'react';

import { useAuth } from '#/components/providers/auth-provider';
import { redirect } from '@tanstack/react-router';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (!user) throw redirect({ to: '/dashboard/sign-in' });

    return <>{children}</>;
};
