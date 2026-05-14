import type { ReactNode } from 'react';

import { redirect } from '@tanstack/react-router';

import { useAuth } from '#/components/providers/auth-provider';
import { route } from '#/lib/route';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (user) throw redirect({ to: route.overviewIndex() });

    return <>{children}</>;
};
