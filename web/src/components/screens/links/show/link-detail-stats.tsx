import type { TLink } from '@/types/models';
import type { TLinkDetailRange } from './link-detail-header';

import { Card, CardHeader } from '@/components/ui/card';

export const LinkDetailStats = ({ range, link }: { range: TLinkDetailRange; link: TLink }) => {
    const days =
        range === '7d' ? 7 : range === '90d' ? 90 : range === 'All' ? link.series.length : 30;
    const slicedSeries = link.series.slice(-days);
    const periodClicks = slicedSeries.reduce((s, d) => s + d.clicks, 0);

    const stats = [
        { label: 'Period Clicks', value: periodClicks.toLocaleString() },
        { label: 'Total Clicks', value: link.clicks.toLocaleString() },
        { label: 'Countries', value: '—' },
        {
            label: 'Created',
            value: new Date(link.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
            }),
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="pb-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-mono text-2xl font-bold tabular-nums">{stat.value}</p>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};
