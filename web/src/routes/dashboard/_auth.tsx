import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getAuth } from '#/collections/users';

export const Route = createFileRoute('/dashboard/_auth')({
    beforeLoad: () => {
        if (!getAuth()) throw redirect({ to: '/dashboard/sign-in' });
    },
    component: () => <Outlet />,
});
