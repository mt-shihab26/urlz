import { useMemo } from 'react';

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TLink } from '@/types/models';

export const OverviewStats = ({ links }: { links: TLink[] }) => {
    const { stats } = useMemo(() => {
        const totalSeries = (() => {
            const byDate = new Map<string, number>();
            links.forEach((link) =>
                link.series.forEach(({ date, clicks }) =>
                    byDate.set(date, (byDate.get(date) ?? 0) + clicks),
                ),
            );
            return Array.from(byDate.entries())
                .map(([date, clicks]) => ({ date, clicks }))
                .sort((a, b) => a.date.localeCompare(b.date));
        })();

        const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
        const prev30 = totalSeries.slice(-60, -30).reduce((s, d) => s + d.clicks, 0);
        const curr30 = totalSeries.slice(-30).reduce((s, d) => s + d.clicks, 0);
        const delta = prev30 > 0 ? Math.round(((curr30 - prev30) / prev30) * 100) : 0;
        const activeLinks = links.filter((l) => l.status === 'active').length;

        return {
            stats: [
                {
                    label: 'Total Clicks',
                    value: totalClicks.toLocaleString(),
                    delta,
                    sub: 'vs prev 30d',
                },
                { label: 'Active Links', value: activeLinks, sub: `of ${links.length} total` },
                {
                    label: 'Avg Clicks / Link',
                    value:
                        links.length > 0
                            ? Math.round(totalClicks / links.length).toLocaleString()
                            : '0',
                    sub: 'lifetime',
                },
                { label: 'Countries', value: '—', sub: 'reached' },
            ],
        };
    }, [links]);

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
