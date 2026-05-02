import type { TClick, TLink } from '@/types/models';

import { clicksToSeries } from '@/lib/clicks';
import { formatNumber } from '@/lib/formats';
import { isLinkActive, isLinkDisabled, isLinkExpired } from '@/lib/links';
import { useMemo } from 'react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

export const StatsCards = ({ clicks, links }: { clicks: TClick[]; links: TLink[] }) => {
    const { stats } = useMemo(() => {
        const totalClicks = clicks.length;
        const series = clicksToSeries(clicks);

        const mid = Math.floor(series.length / 2);
        const firstHalf = series.slice(0, mid).reduce((s, d) => s + d.clicks, 0);
        const secondHalf = series.slice(mid).reduce((s, d) => s + d.clicks, 0);
        const delta = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;

        const activeLinks = links.filter(isLinkActive).length;
        const uniqueVisitors = new Set(clicks.map((c) => c.ip).filter(Boolean)).size;

        const activeDays = series.filter((d) => d.clicks > 0).length;
        const avgDaily = activeDays > 0 ? Math.round(totalClicks / activeDays) : 0;

        const peakDay = series.reduce((max, d) => (d.clicks > max ? d.clicks : max), 0);
        const expiredLinks = links.filter(isLinkExpired).length;
        const disabledLinks = links.filter(isLinkDisabled).length;

        return {
            stats: [
                {
                    label: 'Clicks Count',
                    value: formatNumber(totalClicks),
                    delta,
                    sub: 'period trend',
                },
                {
                    label: 'Active Links',
                    value: activeLinks,
                    sub: `of ${links.length} total`,
                },
                {
                    label: 'Disabled Links',
                    value: disabledLinks || '—',
                    sub: `of ${links.length} total`,
                },
                {
                    label: 'Expired Links',
                    value: expiredLinks || '—',
                    sub: 'past expiry date',
                },
                {
                    label: 'Unique Visitors',
                    value: formatNumber(uniqueVisitors),
                    sub: 'by IP',
                },
                {
                    label: 'Avg Daily Clicks',
                    value: formatNumber(avgDaily),
                    sub: 'on active days',
                },
                {
                    label: 'Peak Day',
                    value: formatNumber(peakDay),
                    sub: 'single day best',
                },
                {
                    label: 'Avg Clicks / Link',
                    value:
                        links.length > 0
                            ? formatNumber(Math.round(totalClicks / links.length))
                            : '0',
                    sub: 'this period',
                },
            ],
        };
    }, [clicks, links]);

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
