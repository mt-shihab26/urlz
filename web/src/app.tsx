import { lazy } from 'react';

import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { PageLoader } from '@/components/composite/page-loader';
import { TooltipProvider } from '@/components/ui/tooltip';

const Overview = lazy(() => import('@/pages/overview'));
const Links = lazy(() => import('@/pages/links'));
const LinkDetail = lazy(() => import('@/pages/link-detail'));
const Analytics = lazy(() => import('@/pages/analytics'));
const Settings = lazy(() => import('@/pages/settings'));
const SignIn = lazy(() => import('@/pages/sign-in'));
const SignUp = lazy(() => import('@/pages/sign-up'));
const ForgotPassword = lazy(() => import('@/pages/forgot-password'));
const ResetPassword = lazy(() => import('@/pages/reset-password'));
const NotFound = lazy(() => import('@/pages/not-found'));

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/overview" replace />} />
                            {/* App */}
                            <Route path="/overview" element={<Overview />} />
                            <Route path="/links" element={<Links />} />
                            <Route path="/links/:id" element={<LinkDetail />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                            {/* Auth */}
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
