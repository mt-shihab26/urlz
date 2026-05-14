import { getAuth } from '#/collections/users';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_auth')({
    beforeLoad: () => {
        if (!getAuth()) throw redirect({ to: '/dashboard/sign-in' });
    },
    component: () => <Outlet />,
});
