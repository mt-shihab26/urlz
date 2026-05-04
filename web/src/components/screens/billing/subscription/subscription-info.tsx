import type { TSubscription } from '@/collections/billing';

import { formatLocaleDate } from '@/lib/formats';

import { Row } from './row';

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
                    subscription.cancel_at_period_end
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
