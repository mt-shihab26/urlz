import type { TSubscription } from '@/collections/billing';

import { formatLocaleDate } from '@/lib/formats';

export const getAlreadyCanceled = (subscription: TSubscription) => {
    return subscription.status === 'canceled';
};

export const getScheduledToCancel = (subscription: TSubscription) => {
    return !!subscription.cancel_at || !!subscription.cancel_at_period_end;
};

export const getCancelDate = (subscription: TSubscription) => {
    return subscription.cancel_at
        ? formatLocaleDate(subscription.cancel_at)
        : formatLocaleDate(subscription.current_period_end);
};
