import { lazy } from 'react';

import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthGuard } from '@/components/composite/auth-guard';
import { GuestGuard } from '@/components/composite/guest-guard';
import { PageLoader } from '@/components/composite/page-loader';

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
                    <AuthProvider>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/overview" replace />} />
                                {/* App */}
                                <Route
                                    path="/overview"
                                    element={
                                        <AuthGuard>
                                            <Overview />
                                        </AuthGuard>
                                    }
                                />
                                <Route
                                    path="/links"
                                    element={
                                        <AuthGuard>
                                            <Links />
                                        </AuthGuard>
                                    }
                                />
                                <Route
                                    path="/links/:id"
                                    element={
                                        <AuthGuard>
                                            <LinkDetail />
                                        </AuthGuard>
                                    }
                                />
                                <Route
                                    path="/analytics"
                                    element={
                                        <AuthGuard>
                                            <Analytics />
                                        </AuthGuard>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <AuthGuard>
                                            <Settings />
                                        </AuthGuard>
                                    }
                                />
                                {/* Auth */}
                                <Route
                                    path="/sign-in"
                                    element={
                                        <GuestGuard>
                                            <SignIn />
                                        </GuestGuard>
                                    }
                                />
                                <Route
                                    path="/sign-up"
                                    element={
                                        <GuestGuard>
                                            <SignUp />
                                        </GuestGuard>
                                    }
                                />
                                <Route
                                    path="/forgot-password"
                                    element={
                                        <GuestGuard>
                                            <ForgotPassword />
                                        </GuestGuard>
                                    }
                                />
                                <Route
                                    path="/reset-password"
                                    element={
                                        <GuestGuard>
                                            <ResetPassword />
                                        </GuestGuard>
                                    }
                                />
                                {/* 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
