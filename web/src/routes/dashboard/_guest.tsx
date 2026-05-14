import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getAuth } from '#/collections/users';

export const Route = createFileRoute('/dashboard/_guest')({
    beforeLoad: () => {
        if (getAuth()) throw redirect({ to: '/dashboard/overview' });
    },
    component: () => <Outlet />,
});
