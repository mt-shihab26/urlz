import { lazy } from 'react';

import type { TRoute } from '@/types/routes';

export const route = {
    root: () => '/',
    overviewIndex: () => '/dashboard/overview',
    linksIndex: () => '/dashboard/links',
    linksShow: (id: string = ':id') => `/dashboard/links/${id}`,
    analyticsIndex: () => '/dashboard/analytics',
    clicksIndex: () => '/dashboard/clicks',
    settingsIndex: () => '/dashboard/settings',
    billingIndex: () => '/dashboard/billing',
    signIn: () => '/dashboard/sign-in',
    signUp: () => '/dashboard/sign-up',
    forgotPassword: () => '/dashboard/forgot-password',
    resetPassword: () => '/dashboard/reset-password',
    notFound: () => '*',
} as const;

export const routes: TRoute[] = [
    // Redirect
    {
        path: route.root(),
        redirect: route.overviewIndex(),
        guard: 'public',
    },
    // App (auth protected)
    {
        path: route.overviewIndex(),
        component: lazy(() => import('@/pages/overview')),
        guard: 'auth',
    },
    {
        path: route.linksIndex(),
        component: lazy(() => import('@/pages/links/index')),
        guard: 'auth',
    },
    {
        path: route.linksShow(),
        component: lazy(() => import('@/pages/links/show')),
        guard: 'auth',
    },
    {
        path: route.analyticsIndex(),
        component: lazy(() => import('@/pages/analytics')),
        guard: 'auth',
    },
    {
        path: route.clicksIndex(),
        component: lazy(() => import('@/pages/clicks')),
        guard: 'auth',
    },
    {
        path: route.settingsIndex(),
        component: lazy(() => import('@/pages/settings')),
        guard: 'auth',
    },
    {
        path: route.billingIndex(),
        component: lazy(() => import('@/pages/billing')),
        guard: 'auth',
    },
    // Auth (guest only)
    {
        path: route.signIn(),
        component: lazy(() => import('@/pages/sign-in')),
        guard: 'guest',
    },
    {
        path: route.signUp(),
        component: lazy(() => import('@/pages/sign-up')),
        guard: 'guest',
    },
    {
        path: route.forgotPassword(),
        component: lazy(() => import('@/pages/forgot-password')),
        guard: 'guest',
    },
    {
        path: route.resetPassword(),
        component: lazy(() => import('@/pages/reset-password')),
        guard: 'guest',
    },
    // Public
    { path: route.notFound(), component: lazy(() => import('@/pages/not-found')), guard: 'public' },
];
