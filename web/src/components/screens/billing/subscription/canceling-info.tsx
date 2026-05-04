import type { TSubscription } from '@/collections/billing';
import type { TSubscriptionStatus } from '@/types/models';

import { useUser } from '@/components/providers/auth-provider';
import { formatLocaleDate } from '@/lib/formats';

export const CancelingInfo = ({ subscription }: { subscription: TSubscription }) => {
    const { user } = useUser();

    const stripeStatus = subscription?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;
    const alreadyCanceled = stripeStatus === 'canceled' || status === 'canceled';
    const canceling = !!subscription?.cancel_at_period_end || !!subscription?.cancel_at;
    const cancelDate = subscription?.cancel_at
        ? formatLocaleDate(subscription.cancel_at)
        : subscription?.current_period_end
          ? formatLocaleDate(subscription.current_period_end)
          : null;

    return (
        <>
            {alreadyCanceled ? (
                <p className="text-sm text-muted-foreground">
                    Your subscription has been canceled. Upgrade below to reactivate.
                </p>
            ) : (
                canceling && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Your subscription is scheduled to cancel
                        {cancelDate ? ` on ${cancelDate}` : ' at the end of the billing period'}.
                        You'll keep access until then.
                    </p>
                )
            )}
        </>
    );
};
