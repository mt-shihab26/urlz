import { lazy } from 'react';

import type { TRoute } from '@/types/routes';

export const routes: TRoute[] = [
    // Redirect
    {
        path: '/',
        redirect: '/overview',
        guard: 'public',
    },
    // App (auth protected)
    {
        path: '/overview',
        component: lazy(() => import('@/pages/overview/index')),
        guard: 'auth',
    },
    {
        path: '/links',
        component: lazy(() => import('@/pages/links/index')),
        guard: 'auth',
    },
    {
        path: '/links/:id',
        component: lazy(() => import('@/pages/links/show')),
        guard: 'auth',
    },
    {
        path: '/analytics',
        component: lazy(() => import('@/pages/analytics/index')),
        guard: 'auth',
    },
    {
        path: '/settings',
        component: lazy(() => import('@/pages/settings')),
        guard: 'auth',
    },
    // Auth (guest only)
    {
        path: '/sign-in',
        component: lazy(() => import('@/pages/sign-in')),
        guard: 'guest',
    },
    {
        path: '/sign-up',
        component: lazy(() => import('@/pages/sign-up')),
        guard: 'guest',
    },
    {
        path: '/forgot-password',
        component: lazy(() => import('@/pages/forgot-password')),
        guard: 'guest',
    },
    {
        path: '/reset-password',
        component: lazy(() => import('@/pages/reset-password')),
        guard: 'guest',
    },
    // Public
    { path: '*', component: lazy(() => import('@/pages/not-found')), guard: 'public' },
];
