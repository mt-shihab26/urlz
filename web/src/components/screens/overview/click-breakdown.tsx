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
        const v = (c[key] as string) || 'Unknown';
        counts[v] = (counts[v] ?? 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([label, count]) => ({ label, count }));
};

export const ClickBreakdown = ({ clicks }: { clicks: TClick[] }) => {
    const { countries, devices, referrers } = useMemo(
        () => ({
            countries: topN(clicks, 'country_name'),
            devices: topN(clicks, 'device'),
            referrers: topN(clicks, 'referrer'),
        }),
        [clicks],
    );

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Top Countries</CardTitle>
                </CardHeader>
                <CardContent>
                    <BreakdownList items={countries} empty="No data" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Devices</CardTitle>
                </CardHeader>
                <CardContent>
                    <BreakdownList items={devices} empty="No data" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                    <BreakdownList items={referrers} empty="No data" />
                </CardContent>
            </Card>
        </div>
    );
};
