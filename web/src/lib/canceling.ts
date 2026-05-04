import type { TSubscription } from '@/collections/billing';
import type { TPlan, TSubscriptionStatus, TUser } from '@/types/models';

import { formatLocaleDate } from '@/lib/formats';

export const getAlreadyCanceled = (subscription: TSubscription) => {
    return subscription.status === 'canceled';
};

export const getScheduledToCancel = (subscription: TSubscription) => {
    return !!subscription.cancel_at || !!subscription.cancel_at_period_end;
};

export const getIsFree = (user: TUser): boolean => {
    return (user.plan ?? 'free') === 'free';
};

export const getCanCancel = (
    subscription: TSubscription | undefined | null,
    user: TUser,
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
