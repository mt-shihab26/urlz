import { getAuth } from '#/collections/users';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { AppSidebar } from '#/components/screens/dashboard-layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_auth')({
    beforeLoad: () => {
        if (!getAuth()) throw redirect({ to: '/dashboard/sign-in' });
    },
    component: () => (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    ),
});
