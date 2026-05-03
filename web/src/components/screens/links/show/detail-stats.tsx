import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { formatDate, formatNumber } from '@/lib/formats';
import { cutoffDate } from '@/lib/utils';
import { useMemo } from 'react';

import { Card, CardHeader } from '@/components/ui/card';

export const DetailStats = ({
    range,
    link,
    clicks,
}: {
    range: TRange;
    link: TLink;
    clicks: TClick[];
}) => {
    const stats = useMemo(() => {
        const cutoff =
            range === '7d'
                ? cutoffDate(7)
                : range === '90d'
                  ? cutoffDate(90)
                  : range === '30d'
                    ? cutoffDate(30)
                    : null;

        const periodClicks = cutoff ? clicks.filter((c) => c.date >= cutoff).length : clicks.length;

        const uniqueCountries = new Set(clicks.map((c) => c.country_code).filter(Boolean)).size;

        return [
            { label: 'Period Clicks', value: formatNumber(periodClicks) },
            { label: 'Total Clicks', value: formatNumber(clicks.length) },
            { label: 'Countries', value: formatNumber(uniqueCountries) },
            { label: 'Created', value: formatDate(link.created) },
        ];
    }, [range, link, clicks]);

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
