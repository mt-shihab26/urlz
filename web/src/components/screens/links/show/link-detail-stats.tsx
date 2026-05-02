import type { TLink } from '@/types/models';
import type { TLinkDetailRange } from './link-detail-header';

import { formatDate, formatNumber } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardHeader } from '@/components/ui/card';

const cutoffDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
};

export const LinkDetailStats = ({ range, link }: { range: TLinkDetailRange; link: TLink }) => {
    const stats = useMemo(() => {
        const cutoff =
            range === '7d'
                ? cutoffDate(7)
                : range === '90d'
                  ? cutoffDate(90)
                  : range === '30d'
                    ? cutoffDate(30)
                    : null;

        const periodClicks = cutoff
            ? link.clicks.filter((c) => c.date >= cutoff).length
            : link.clicks.length;

        const uniqueCountries = new Set(link.clicks.map((c) => c.country_code).filter(Boolean))
            .size;

        return [
            { label: 'Period Clicks', value: formatNumber(periodClicks) },
            { label: 'Total Clicks', value: formatNumber(link.clicks.length) },
            { label: 'Countries', value: formatNumber(uniqueCountries) },
            { label: 'Created', value: formatDate(link.created) },
        ];
    }, [range, link]);

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
