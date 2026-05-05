import type { TSubscription } from '@/collections/billing';
import type { TSubscriptionStatus, TUser } from '@/types/models';

import { formatLocaleDate } from '@/lib/formats';

export const getCurrentPlan = (user: TUser) => {
    return user.plan || 'free';
};

export const getAlreadyCanceled = (subscription: TSubscription) => {
    return subscription.status === 'canceled';
};

export const getScheduledToCancel = (subscription: TSubscription | null | undefined): boolean => {
    if (!subscription) return false;
    return !!subscription.cancel_at || !!subscription.cancel_at_period_end;
};

export const getIsFree = (user: TUser): boolean => {
    return (user.plan ?? 'free') === 'free';
};

export const getCanCancel = (
    user: TUser,
    subscription: TSubscription | undefined | null,
): boolean => {
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
