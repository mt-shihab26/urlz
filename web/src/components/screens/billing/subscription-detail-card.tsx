import type { TSubscriptionInfo } from '@/collections/billing';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fmt = (ts: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

export const SubscriptionDetailCard = ({ sub }: { sub: TSubscriptionInfo }) => (
    <Card>
        <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="divide-y-0">
            <Row label="Subscription ID" value={<span className="font-mono text-xs">{sub.id}</span>} />
            <Row label="Started" value={fmt(sub.start_date)} />
            <Row label="Current period" value={`${fmt(sub.current_period_start)} – ${fmt(sub.current_period_end)}`} />
            <Row
                label="Renews / ends"
                value={
                    sub.cancel_at_period_end
                        ? `Cancels ${fmt(sub.cancel_at ?? sub.current_period_end)}`
                        : fmt(sub.current_period_end)
                }
            />
            {sub.trial_end && <Row label="Trial ends" value={fmt(sub.trial_end)} />}
        </CardContent>
    </Card>
);
