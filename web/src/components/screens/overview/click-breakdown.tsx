import type { TClick } from '@/types/models';
import type { TBreakdownItem } from './breakdown-list';

import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreakdownList } from './breakdown-list';

const topN = (clicks: TClick[], key: keyof TClick, n = 5): TBreakdownItem[] => {
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
        { title: 'Top Devices', items: devices },
        { title: 'Top Referrers', items: referrers },
        { title: 'Top Browsers', items: browsers },
        { title: 'Top Operating Systems', items: os },
        { title: 'Top Languages', items: languages },
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
