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
} as const;
