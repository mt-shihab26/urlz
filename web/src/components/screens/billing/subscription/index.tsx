import type { TSubscription } from '#/collections/billing';

import { useUser } from '#/components/providers/auth-provider';
import { getCanCancel, getIsFree, getScheduledToCancel } from '#/lib/billing';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { CancelButton } from './cancel-button';
import { CancelingInfo } from './canceling-info';
import { PlanLavel } from './plan-label';
import { StatusLabel } from './status-label';
import { SubscriptionInfo } from './subscription-info';
import { UncancelButton } from './uncancel-button';

export const Subscription = ({ subscription }: { subscription: TSubscription | null }) => {
    const { user } = useUser();

    const scheduledCancel = getScheduledToCancel(subscription ?? null, user);
    const canCancel = getCanCancel(user, subscription ?? null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {!subscription ? (
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
                                    {scheduledCancel && <UncancelButton />}
                                    {canCancel && <CancelButton />}
                                </div>
                            )}
                        </div>
                        <CancelingInfo subscription={subscription} user={user} />
                        <SubscriptionInfo subscription={subscription} />
                    </>
                )}
            </CardContent>
        </Card>
    );
};
