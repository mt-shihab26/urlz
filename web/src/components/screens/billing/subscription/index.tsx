import { getSubscription } from '@/collections/billing';
import { useUser } from '@/components/providers/auth-provider';
import { getCanCancel, getIsFree, getScheduledToCancel } from '@/lib/canceling';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CancelButton } from './cancel-button';
import { CancelingInfo } from './canceling-info';
import { UncancelButton } from './uncancel-button';
import { Loading } from './loading';
import { ManageButton } from './manage-button';
import { PlanLavel } from './plan-label';
import { StatusLabel } from './status-label';
import { SubscriptionInfo } from './subscription-info';

export const Subscription = () => {
    const { user } = useUser();

    const { data: subscription, isLoading } = useQuery({
        queryKey: queryKeys.subscription,
        queryFn: getSubscription,
        throwOnError: (e: unknown) => {
            toastError(e);
            return false;
        },
    });

    const canCancel = getCanCancel(subscription, user);
    const scheduledCancel = subscription ? getScheduledToCancel(subscription) : false;

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
                            {!getIsFree(user) && (
                                <div className="flex items-center gap-2">
                                    <ManageButton />
                                    {scheduledCancel && <UncancelButton />}
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
