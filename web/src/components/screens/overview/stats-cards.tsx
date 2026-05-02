import type { TClick, TLink } from '@/types/models';

import { clicksToSeries } from '@/lib/clicks';
import { formatNumber } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

export const StatsCards = ({ clicks, links }: { clicks: TClick[]; links: TLink[] }) => {
    const { stats } = useMemo(() => {
        const totalClicks = clicks.length;
        const totalSeries = clicksToSeries(clicks);

        const prev30 = totalSeries.slice(-60, -30).reduce((s, d) => s + d.clicks, 0);
        const curr30 = totalSeries.slice(-30).reduce((s, d) => s + d.clicks, 0);
        const delta = prev30 > 0 ? Math.round(((curr30 - prev30) / prev30) * 100) : 0;

        const activeLinks = links.filter((l) => l.status === 'active').length;
        const uniqueVisitors = new Set(clicks.map((c) => c.ip).filter(Boolean)).size;
        const last7 = totalSeries.slice(-7).reduce((s, d) => s + d.clicks, 0);

        return {
            stats: [
                {
                    label: 'Total Clicks',
                    value: formatNumber(totalClicks),
                    delta,
                    sub: 'vs prev 30d',
                },
                {
                    label: 'Active Links',
                    value: activeLinks,
                    sub: `of ${links.length} total`,
                },
                {
                    label: 'Unique Visitors',
                    value: formatNumber(uniqueVisitors),
                    sub: 'by IP',
                },
                {
                    label: 'Clicks Last 7d',
                    value: formatNumber(last7),
                    sub: 'recent activity',
                },
            ],
        };
    }, [clicks, links]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
                <Card key={s.label}>
                    <CardHeader className="pb-2">
                        <CardDescription>{s.label}</CardDescription>
                        <CardTitle className="text-3xl font-bold tabular-nums">{s.value}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-2 text-sm">
                        {s.delta !== undefined && (
                            <span
                                className={
                                    s.delta >= 0
                                        ? 'flex items-center gap-1 font-medium text-green-600 dark:text-green-400'
                                        : 'flex items-center gap-1 font-medium text-destructive'
                                }
                            >
                                {s.delta >= 0 ? (
                                    <TrendingUpIcon className="size-4" />
                                ) : (
                                    <TrendingDownIcon className="size-4" />
                                )}
                                {s.delta >= 0 ? '+' : ''}
                                {s.delta}%
                            </span>
                        )}
                        {s.sub && <span className="text-muted-foreground">{s.sub}</span>}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
