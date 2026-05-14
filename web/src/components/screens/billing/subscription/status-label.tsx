import type { TSubscription } from '#/collections/billing';
import type { TSubscriptionStatus, TUser } from '#/types/models';

import { Badge } from '#/components/ui/badge';

const STATUS_LABEL: Record<TSubscriptionStatus, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past due',
    canceled: 'Canceled',
    unpaid: 'Unpaid',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    paused: 'Paused',
};

const STATUS_VARIANT: Record<
    TSubscriptionStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    active: 'default',
    trialing: 'secondary',
    past_due: 'destructive',
    canceled: 'outline',
    unpaid: 'destructive',
    incomplete: 'secondary',
    incomplete_expired: 'destructive',
    paused: 'secondary',
};

export const StatusLabel = ({
    user,
    subscription,
}: {
    user: TUser;
    subscription?: TSubscription | null;
}) => {
    const stripeStatus = subscription?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;

    return (
        <>
            {status && (
                <Badge variant={STATUS_VARIANT[status] ?? 'outline'}>
                    {STATUS_LABEL[status] ?? status}
                </Badge>
            )}
        </>
    );
};
