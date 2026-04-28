import { lazy } from 'react';

export type TRouteGuard = 'auth' | 'guest' | 'public';

export type TRoute = {
    path: string;
    component: React.LazyExoticComponent<() => React.JSX.Element>;
    guard: TRouteGuard;
};

export const routes: TRoute[] = [
    // App (auth protected)
    { path: '/overview', component: lazy(() => import('@/pages/overview')), guard: 'auth' },
    { path: '/links', component: lazy(() => import('@/pages/links')), guard: 'auth' },
    { path: '/links/:id', component: lazy(() => import('@/pages/link-detail')), guard: 'auth' },
    { path: '/analytics', component: lazy(() => import('@/pages/analytics')), guard: 'auth' },
    { path: '/settings', component: lazy(() => import('@/pages/settings')), guard: 'auth' },
    // Auth (guest only)
    { path: '/sign-in', component: lazy(() => import('@/pages/sign-in')), guard: 'guest' },
    { path: '/sign-up', component: lazy(() => import('@/pages/sign-up')), guard: 'guest' },
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
