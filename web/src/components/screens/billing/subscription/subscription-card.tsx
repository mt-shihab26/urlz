import type { TSubscription } from '@/collections/billing';
import type { TSubscriptionStatus, TUser } from '@/types/models';

import { formatLocaleDate } from '@/lib/formats';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CancelButton } from './cancel-button';
import { ManageButton } from './manage-button';
import { PlanLavel } from './plan-label';
import { StatusLabel } from './status-label';

export const SubscriptionCard = ({ user, sub }: { user: TUser; sub?: TSubscription | null }) => {
    const plan = user.plan || 'free';
    // Prefer live Stripe status from billing info over stale PB value
    const stripeStatus = sub?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;
    const alreadyCanceled = stripeStatus === 'canceled' || status === 'canceled';
    const canceling = !!sub?.cancel_at_period_end;
    const canCancel =
        !alreadyCanceled && plan !== 'free' && (status === 'active' || status === 'trialing');

    const cancelDate = sub?.cancel_at
        ? formatLocaleDate(sub.cancel_at)
        : sub?.current_period_end
          ? formatLocaleDate(sub.current_period_end)
          : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <PlanLavel user={user} />
                        <StatusLabel user={user} subscription={sub} />
                    </div>
                    {plan !== 'free' && (
                        <div className="flex items-center gap-2">
                            <ManageButton />
                            {canCancel && <CancelButton />}
                        </div>
                    )}
                </div>
                {canceling && !alreadyCanceled && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Your subscription is scheduled to cancel
                        {cancelDate ? ` on ${cancelDate}` : ' at the end of the billing period'}.
                        You'll keep access until then.
                    </p>
                )}
                {alreadyCanceled && (
                    <p className="text-sm text-muted-foreground">
                        Your subscription has been canceled. Upgrade below to reactivate.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
