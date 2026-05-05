import type { TPlan, TSubscriptionStatus, TUser } from '@/types/models';

const ACTIVE_STATUSES: TSubscriptionStatus[] = ['active', 'trialing'];

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
