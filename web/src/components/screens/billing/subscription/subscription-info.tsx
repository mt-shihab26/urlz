import type { TSubscription } from '@/collections/billing';
import type { ReactNode } from 'react';

import { formatLocaleDate } from '@/lib/formats';

export const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

export const SubscriptionInfo = ({ subscription }: { subscription: TSubscription }) => {
    return (
        <div className="border-t pt-4">
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
                    subscription.cancel_at_period_end || subscription.cancel_at
                        ? `Cancels ${formatLocaleDate(subscription.cancel_at ?? subscription.current_period_end)}`
                        : formatLocaleDate(subscription.current_period_end)
                }
            />
            {subscription.trial_end && (
                <Row label="Trial ends" value={formatLocaleDate(subscription.trial_end)} />
            )}
        </div>
    );
};
