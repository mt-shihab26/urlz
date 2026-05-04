import { getSubscription } from '@/collections/billing';
import { formatLocaleDate } from '@/lib/formats';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

const Loading = () => (
    <>
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b last:border-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
            </div>
        ))}
    </>
);

export const SubscriptionDetail = () => {
    const { data: subscription, isLoading } = useQuery({
        queryKey: queryKeys.subscription,
        queryFn: getSubscription,
        throwOnError: (e) => toastError(e),
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="divide-y-0">
                {isLoading ? (
                    <Loading />
                ) : !subscription ? (
                    <p className="text-sm text-muted-foreground">No subscription found.</p>
                ) : (
                    <>
                        <Row
                            label="Subscription ID"
                            value={<span className="font-mono text-xs">{subscription.id}</span>}
                        />
                        <Row label="Started" value={formatLocaleDate(subscription.start_date)} />
                        <Row
                            label="Current period"
                            value={`${formatLocaleDate(subscription.current_period_start)} – ${formatLocaleDate(subscription.current_period_end)}`}
                        />
                        <Row
                            label="Renews / ends"
                            value={
                                subscription.cancel_at_period_end
                                    ? `Cancels ${formatLocaleDate(subscription.cancel_at ?? subscription.current_period_end)}`
                                    : formatLocaleDate(subscription.current_period_end)
                            }
                        />
                        {subscription.trial_end && (
                            <Row
                                label="Trial ends"
                                value={formatLocaleDate(subscription.trial_end)}
                            />
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
