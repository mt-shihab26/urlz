import type { TClick } from '@/types/models';

import { formatNumber } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BreakdownItem = { label: string; count: number };

const BreakdownList = ({ items, empty }: { items: BreakdownItem[]; empty: string }) => {
    const max = items[0]?.count ?? 1;
    return (
        <div className="flex flex-col gap-2.5">
            {items.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{empty}</p>
            ) : (
                items.map(({ label, count }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 truncate text-sm" title={label}>
                            {label || '—'}
                        </span>
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.round((count / max) * 100)}%` }}
                            />
                        </div>
                        <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                            {formatNumber(count)}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

const topN = (clicks: TClick[], key: keyof TClick, n = 5): BreakdownItem[] => {
    const counts: Record<string, number> = {};
    for (const c of clicks) {
        const v = (c[key] as string) || '';
        if (!v) continue;
        counts[v] = (counts[v] ?? 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([label, count]) => ({ label, count }));
};

export const ClickBreakdown = ({ clicks }: { clicks: TClick[] }) => {
    const { countries, devices, referrers, browsers, os, languages } = useMemo(
        () => ({
            countries: topN(clicks, 'country_name'),
            devices: topN(clicks, 'device'),
            referrers: topN(clicks, 'referrer'),
            browsers: topN(clicks, 'browser'),
            os: topN(clicks, 'os'),
            languages: topN(clicks, 'language'),
        }),
        [clicks],
    );

    const cards = [
        { title: 'Top Countries', items: countries },
        { title: 'Devices', items: devices },
        { title: 'Top Referrers', items: referrers },
        { title: 'Browsers', items: browsers },
        { title: 'Operating Systems', items: os },
        { title: 'Languages', items: languages },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ title, items }) => (
                <Card key={title}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BreakdownList items={items} empty="No data" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
