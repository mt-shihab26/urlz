import type { ReactNode } from 'react';

import { useEffect } from 'react';

import { AppSidebar } from '#/components/screens/dashboard-layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar';

export const DashboardLayout = ({ title, children }: { title: string; children: ReactNode }) => {
    useEffect(() => {
        document.title = title ? `${title} — urlz` : 'urlz';
    }, [title]);

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
};
