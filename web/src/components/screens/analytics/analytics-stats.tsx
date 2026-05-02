import type { TClick, TLink } from '@/types/models';

import { formatNumber } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsStats = ({ clicks, links }: { clicks: TClick[]; links: TLink[] }) => {
    const stats = useMemo(() => {
        const totalClicks = clicks.length;
        const activeLinks = links.filter((l) => l.status === 'active').length;
        const uniqueCountries = new Set(clicks.map((c) => c.country_code).filter(Boolean)).size;

        const referrerCounts = new Map<string, number>();
        clicks.forEach(({ referrer }) => {
            if (referrer) referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);
        });
        const topReferrer =
            referrerCounts.size > 0
                ? [...referrerCounts.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                : '—';

        const countryCounts = new Map<string, { name: string; count: number }>();
        clicks.forEach(({ country_code, country_name }) => {
            if (country_code) {
                const prev = countryCounts.get(country_code);
                countryCounts.set(country_code, {
                    name: country_name,
                    count: (prev?.count ?? 0) + 1,
                });
            }
        });
        const topCountry =
            countryCounts.size > 0
                ? [...countryCounts.values()].reduce((a, b) => (a.count > b.count ? a : b)).name
                : '—';

        const avgClicks =
            links.length > 0 ? formatNumber(Math.round(totalClicks / links.length)) : '0';

        const expiringSoon = links.filter((l) => {
            if (!l.expires) return false;
            const t = new Date(l.expires).getTime();
            const now = Date.now();
            return t > now && t <= now + 30 * 24 * 60 * 60 * 1000;
        }).length;

        const linkedIds = new Set(clicks.map((c) => c.link));
        const noClicks = links.filter((l) => !linkedIds.has(l.id)).length;

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
    }, [clicks, links]);

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
