import type { TSubscription } from '@/collections/billing';
import type { TSubscriptionStatus, TUser } from '@/types/models';

import { formatLocaleDate } from '@/lib/formats';

export const getCurrentPlan = (user: TUser) => {
    return user.plan || 'free';
};

export const getAlreadyCanceled = (subscription: TSubscription) => {
    return subscription.status === 'canceled';
};

export const getScheduledToCancel = (
    subscription: TSubscription | null,
    user: TUser | null,
): boolean => {
    if (!subscription) return !!user?.subscription_cancel_at;
    return !!subscription.cancel_at || !!subscription.cancel_at_period_end;
};

export const getIsFree = (user: TUser): boolean => {
    return (user.plan ?? 'free') === 'free';
};

export const getCanCancel = (user: TUser | null, subscription: TSubscription | null): boolean => {
    if (!user) return false;
    if (getIsFree(user)) return false;
    const stripeStatus = subscription?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;
    const alreadyCanceled = stripeStatus === 'canceled' || status === 'canceled';
    const scheduledCancel = !!subscription?.cancel_at || !!subscription?.cancel_at_period_end;
    return !alreadyCanceled && !scheduledCancel && (status === 'active' || status === 'trialing');
};

export const getCancelDate = (subscription: TSubscription) => {
    return subscription.cancel_at
        ? formatLocaleDate(subscription.cancel_at)
        : formatLocaleDate(subscription.current_period_end);
};
