import { routes } from '@/routes';

import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AuthGuard } from '@/components/composite/auth-guard';
import { GuestGuard } from '@/components/composite/guest-guard';
import { PageLoader } from '@/components/composite/page-loader';
import { PublicGuard } from '@/components/composite/public-guard';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

const guardMap = {
    auth: AuthGuard,
    guest: GuestGuard,
    public: PublicGuard,
};

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {routes.map((route) => {
                                const Guard = guardMap[route.guard];
                                const element =
                                    'redirect' in route ? (
                                        <Navigate to={route.redirect} replace />
                                    ) : (
                                        <route.component />
                                    );
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={<Guard>{element}</Guard>}
                                    />
                                );
                            })}
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
