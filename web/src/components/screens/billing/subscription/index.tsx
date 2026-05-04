import type { TSubscriptionStatus, TUser } from '@/types/models';

import { getSubscription } from '@/collections/billing';
import { formatLocaleDate } from '@/lib/formats';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CancelButton } from './cancel-button';
import { ManageButton } from './manage-button';
import { PlanLavel } from './plan-label';
import { StatusLabel } from './status-label';

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

export const Subscription = ({ user }: { user: TUser }) => {
    const { data: sub, isLoading } = useQuery({
        queryKey: queryKeys.subscription,
        queryFn: getSubscription,
        throwOnError: (e: unknown) => {
            toastError(e);
            return false;
        },
    });

    const plan = user.plan || 'free';
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
                <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {isLoading ? (
                    <>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-7 w-16" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between py-1.5 border-b last:border-0"
                                >
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
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
                        <div className="border-t pt-4">
                            {!sub ? (
                                <p className="text-sm text-muted-foreground">No subscription found.</p>
                            ) : (
                                <>
                                    <Row
                                        label="Subscription ID"
                                        value={<span className="font-mono text-xs">{sub.id}</span>}
                                    />
                                    <Row label="Started" value={formatLocaleDate(sub.start_date)} />
                                    <Row
                                        label="Current period"
                                        value={`${formatLocaleDate(sub.current_period_start)} – ${formatLocaleDate(sub.current_period_end)}`}
                                    />
                                    <Row
                                        label="Renews / ends"
                                        value={
                                            sub.cancel_at_period_end
                                                ? `Cancels ${formatLocaleDate(sub.cancel_at ?? sub.current_period_end)}`
                                                : formatLocaleDate(sub.current_period_end)
                                        }
                                    />
                                    {sub.trial_end && (
                                        <Row label="Trial ends" value={formatLocaleDate(sub.trial_end)} />
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
