import type { TPlan, TSubscriptionStatus, TUser } from '@/types/models';

const ACTIVE_STATUSES: TSubscriptionStatus[] = ['active', 'trialing'];

export type TFeature = 'links' | 'analytics' | 'expiry' | 'api' | 'custom_domains' | 'team_members';

export const PLAN_RANK: Record<TPlan, number> = {
    free: 0,
    pro: 1,
    business: 2,
};

export const LINK_LIMIT: Record<TPlan, number> = {
    free: 5,
    pro: Infinity,
    business: Infinity,
};

export const FEATURE_MIN_PLAN: Record<TFeature, TPlan> = {
    links: 'pro',
    analytics: 'pro',
    expiry: 'pro',
    api: 'business',
    custom_domains: 'business',
    team_members: 'business',
};

export const canUseFeature = (plan: TPlan, feature: TFeature): boolean => {
    return PLAN_RANK[plan] >= PLAN_RANK[FEATURE_MIN_PLAN[feature]];
};

export const getLinkLimit = (plan: TPlan): number => LINK_LIMIT[plan];

export const hasReachedLinkLimit = (plan: TPlan, count: number): boolean => {
    const limit = LINK_LIMIT[plan];
    return limit !== Infinity && count >= limit;
};

export const getActivePlan = (user: TUser | null | undefined): TPlan => {
    if (!user || !isPlanActive(user)) {
        return 'free';
    }
    return user.plan ?? 'free';
};

export const isPlanActive = (user: TUser | null | undefined): boolean => {
    if (!user) {
        return false;
    }
    const status = user.subscription_status;
    if (!status || !ACTIVE_STATUSES.includes(status)) {
        return false;
    }
    if (user.subscription_cancel_at && new Date(user.subscription_cancel_at) <= new Date()) {
        return false;
    }
    return true;
};
