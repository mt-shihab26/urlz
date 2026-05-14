import { createRootRoute } from '@tanstack/react-router';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { AuthProvider } from '#/components/providers/auth-provider';
import { ThemeProvider } from '#/components/providers/theme-provider';
import { Button } from '#/components/ui/button';
import { Toaster } from '#/components/ui/sonner';
import { TooltipProvider } from '#/components/ui/tooltip';

import styles from '../styles.css?url';

const queryClient = new QueryClient();

export const Route = createRootRoute({
    head: () => ({
        links: [{ rel: 'stylesheet', href: styles }],
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'urlz' },
        ],
    }),
    shellComponent: ({ children }) => (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <TanStackDevtools
                    config={{ position: 'bottom-right' }}
                    plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
                />
                <Scripts />
            </body>
        </html>
    ),
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <TooltipProvider>
                        <Outlet />
                        <Toaster />
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
