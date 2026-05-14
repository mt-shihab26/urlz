import type { TSubscription } from '#/collections/billing';
import type { TUser } from '#/types/models';

import { getAlreadyCanceled, getCancelDate, getScheduledToCancel } from '#/lib/billing';

export const CancelingInfo = ({
    subscription,
    user,
}: {
    subscription: TSubscription;
    user: TUser | null;
}) => {
    const alreadyCanceled = getAlreadyCanceled(subscription);
    const scheduledToCancel = getScheduledToCancel(subscription, user);
    const cancelDate = getCancelDate(subscription);

    return (
        <>
            {alreadyCanceled ? (
                <p className="text-sm text-muted-foreground">
                    Your subscription has been canceled. Upgrade below to reactivate.
                </p>
            ) : (
                scheduledToCancel && (
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
