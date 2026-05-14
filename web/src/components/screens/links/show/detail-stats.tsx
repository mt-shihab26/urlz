import type { TStats } from '#/services/links/show';

import { formatDate, formatNumber } from '#/lib/formats';

import { Card, CardHeader } from '#/components/ui/card';

export const DetailStats = ({ stats, created }: { stats: TStats; created: string }) => {
    const items = [
        { label: 'Period Clicks', value: formatNumber(stats.period_clicks) },
        { label: 'Total Clicks', value: formatNumber(stats.total_clicks) },
        { label: 'Countries', value: formatNumber(stats.unique_countries) },
        { label: 'Created', value: formatDate(created) },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label}>
                    <CardHeader className="pb-1">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-mono text-2xl font-bold tabular-nums">{item.value}</p>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};
