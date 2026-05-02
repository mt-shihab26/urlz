import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { formatNumber } from '@/lib/formats';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsStats = ({ links }: { links: TLink[] }) => {
    const stats = useMemo(() => {
        const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
        const activeLinks = links.filter((l) => l.status === 'active').length;
        const uniqueCountries = new Set(links.flatMap((l) => l.countries.map((c) => c.code))).size;
        const allReferrers = links.flatMap((l) => l.referrers);
        const topReferrer =
            allReferrers.length > 0
                ? allReferrers.reduce((a, b) => (a.clicks > b.clicks ? a : b)).source
                : '—';

        return [
            { label: 'Total Clicks', value: formatNumber(totalClicks) },
            { label: 'Active Links', value: `${activeLinks} / ${links.length}` },
            { label: 'Unique Countries', value: uniqueCountries || '—' },
            { label: 'Top Referrer', value: topReferrer },
        ];
    }, [links]);

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((s) => (
                <Card key={s.label}>
                    <CardHeader className="pb-2">
                        <CardDescription>{s.label}</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums">{s.value}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};
