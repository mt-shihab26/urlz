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
        const avgClicks =
            links.length > 0 ? formatNumber(Math.round(totalClicks / links.length)) : '0';
        const expiringSoon = links.filter((l) => {
            if (!l.expires) return false;
            const t = new Date(l.expires).getTime();
            const now = Date.now();
            return t > now && t <= now + 30 * 24 * 60 * 60 * 1000;
        }).length;
        const allCountries = links.flatMap((l) => l.countries);
        const topCountry =
            allCountries.length > 0
                ? allCountries.reduce((a, b) => (a.clicks > b.clicks ? a : b)).country
                : '—';
        const noClicks = links.filter((l) => l.clicks === 0).length;

        return [
            { label: 'Total Clicks', value: formatNumber(totalClicks) },
            { label: 'Active Links', value: `${activeLinks} / ${links.length}` },
            { label: 'Avg Clicks / Link', value: avgClicks },
            { label: 'Unique Countries', value: uniqueCountries || '—' },
            { label: 'Top Country', value: topCountry },
            { label: 'Top Referrer', value: topReferrer },
            { label: 'No Clicks', value: noClicks || '—' },
            { label: 'Expiring Soon', value: expiringSoon || '—' },
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
