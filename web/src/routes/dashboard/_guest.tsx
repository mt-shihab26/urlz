import logo from '#/assets/logo.svg';

import { getAuth } from '#/collections/users';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_guest')({
    beforeLoad: () => {
        if (getAuth()) throw redirect({ to: '/dashboard/overview' });
    },
    component: () => (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
            <div className="mb-6 flex items-center gap-2">
                <img src={logo} alt="urlz" className="size-8" />
                <Link to="/dashboard/overview" className="text-lg font-bold tracking-tight">
                    urlz
                </Link>
            </div>
            <div className="w-full max-w-sm">
                <Outlet />
            </div>
        </div>
    ),
});
