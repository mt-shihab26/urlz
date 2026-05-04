import type { TSubscription } from '@/collections/billing';

import { getSubscription } from '@/collections/billing';
import { formatLocaleDate } from '@/lib/formats';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

export const SubscriptionDetail = () => {
    const [subscription, setBillingInfo] = useState<TSubscription | null>(null);

    const fetchBillingInfo = async () => {
        try {
            const info = await getSubscription();
            setBillingInfo(info);
        } catch {}
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="divide-y-0">
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
                    <Row label="Trial ends" value={formatLocaleDate(subscription.trial_end)} />
                )}
            </CardContent>
        </Card>
    );
};
