import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '#/components/providers/auth-provider';
import { ThemeProvider } from '#/components/providers/theme-provider';
import { Toaster } from '#/components/ui/sonner';
import { TooltipProvider } from '#/components/ui/tooltip';
import NotFound from '#/pages/not-found';

import appCss from '../styles.css?url';

const queryClient = new QueryClient();

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'urlz' },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
    shellComponent: RootDocument,
});

function RootComponent() {
    return (
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
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
