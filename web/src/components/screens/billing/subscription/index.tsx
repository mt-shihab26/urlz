import type { TSubscriptionStatus } from '@/types/models';

import { getSubscription } from '@/collections/billing';
import { useUser } from '@/components/providers/auth-provider';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CancelButton } from './cancel-button';
import { CancelingInfo } from './canceling-info';
import { Loading } from './loading';
import { ManageButton } from './manage-button';
import { PlanLavel } from './plan-label';
import { StatusLabel } from './status-label';
import { SubscriptionInfo } from './subscription-info';

export const Subscription = () => {
    const { user } = useUser();

    const plan = user.plan || 'free';

    const { data: subscription, isLoading } = useQuery({
        queryKey: queryKeys.subscription,
        queryFn: getSubscription,
        throwOnError: (e: unknown) => {
            toastError(e);
            return false;
        },
    });

    const stripeStatus = subscription?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;
    const alreadyCanceled = stripeStatus === 'canceled' || status === 'canceled';
    const scheduledCancel = !!subscription?.cancel_at || !!subscription?.cancel_at_period_end;
    const canCancel =
        !alreadyCanceled && !scheduledCancel && plan !== 'free' && (status === 'active' || status === 'trialing');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {isLoading ? (
                    <Loading />
                ) : !subscription ? (
                    <p className="text-sm text-muted-foreground">No subscription found.</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <PlanLavel user={user} />
                                <StatusLabel user={user} subscription={subscription} />
                            </div>
                            {plan !== 'free' && (
                                <div className="flex items-center gap-2">
                                    <ManageButton />
                                    {canCancel && <CancelButton />}
                                </div>
                            )}
                        </div>
                        <CancelingInfo subscription={subscription} />
                        <SubscriptionInfo subscription={subscription} />
                    </>
                )}
            </CardContent>
        </Card>
    );
};
