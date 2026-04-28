import { routes } from '@/routes';

import { Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AuthGuard } from '@/components/composite/auth-guard';
import { GuestGuard } from '@/components/composite/guest-guard';
import { PageLoader } from '@/components/composite/page-loader';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

const guardMap = {
    auth: AuthGuard,
    guest: GuestGuard,
    public: ({ children }: { children: ReactNode }) => <>{children}</>,
};

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <AuthProvider>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/overview" replace />} />
                                {routes.map(({ path, component: Page, guard }) => {
                                    const Guard = guardMap[guard];
                                    return (
                                        <Route
                                            key={path}
                                            path={path}
                                            element={
                                                <Guard>
                                                    <Page />
                                                </Guard>
                                            }
                                        />
                                    );
                                })}
                            </Routes>
                        </Suspense>
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
