import '#/styles.css';

import { createRootRoute } from '@tanstack/react-router';

import { AuthProvider } from '#/components/providers/auth-provider';
import { ThemeProvider } from '#/components/providers/theme-provider';
import { Button } from '#/components/ui/button';
import { Toaster } from '#/components/ui/sonner';
import { TooltipProvider } from '#/components/ui/tooltip';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

const queryClient = new QueryClient();

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <TooltipProvider>
                        <Outlet />
                        <Toaster />
                        <TanStackDevtools
                            config={{
                                position: 'bottom-right',
                            }}
                            plugins={[
                                {
                                    name: 'TanStack Router',
                                    render: <TanStackRouterDevtoolsPanel />,
                                },
                            ]}
                        />
                    </TooltipProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    ),
    notFoundComponent: () => (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <span className="text-8xl font-bold tracking-tight text-muted-foreground/30">
                    404
                </span>
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    This page doesn't exist or was moved.
                </p>
            </div>
            <Link to="/dashboard/overview">
                <Button>Go home</Button>
            </Link>
        </div>
    ),
});
