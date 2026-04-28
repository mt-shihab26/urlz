export type TRouteGuard = 'auth' | 'guest' | 'public';

export type TComponentRoute = {
    path: string;
    component: React.LazyExoticComponent<() => React.JSX.Element>;
    guard: TRouteGuard;
};

export type TRedirectRoute = {
    path: string;
    redirect: string;
    guard: TRouteGuard;
};

export type TRoute = TComponentRoute | TRedirectRoute;
