import { lazy } from 'react';

import type { TRoute } from '@/types/routes';

export const routes: TRoute[] = [
    // Redirect
    {
        path: '/',
        redirect: '/dashboard/overview',
        guard: 'public',
    },
    // App (auth protected)
    {
        path: '/dashboard/overview',
        component: lazy(() => import('@/pages/overview/index')),
        guard: 'auth',
    },
    {
        path: '/dashboard/links',
        component: lazy(() => import('@/pages/links/index')),
        guard: 'auth',
    },
    {
        path: '/dashboard/links/:id',
        component: lazy(() => import('@/pages/links/show')),
        guard: 'auth',
    },
    {
        path: '/dashboard/analytics',
        component: lazy(() => import('@/pages/analytics/index')),
        guard: 'auth',
    },
    {
        path: '/dashboard/settings',
        component: lazy(() => import('@/pages/settings/index')),
        guard: 'auth',
    },
    // Auth (guest only)
    {
        path: '/dashboard/sign-in',
        component: lazy(() => import('@/pages/sign-in')),
        guard: 'guest',
    },
    {
        path: '/dashboard/sign-up',
        component: lazy(() => import('@/pages/sign-up')),
        guard: 'guest',
    },
    {
        path: '/dashboard/forgot-password',
        component: lazy(() => import('@/pages/forgot-password')),
        guard: 'guest',
    },
    {
        path: '/dashboard/reset-password',
        component: lazy(() => import('@/pages/reset-password')),
        guard: 'guest',
    },
    // Public
    { path: '*', component: lazy(() => import('@/pages/not-found')), guard: 'public' },
];
