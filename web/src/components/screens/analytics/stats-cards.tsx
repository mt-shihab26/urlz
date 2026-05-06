import type { TStats } from '@/services/analytics';

import { formatNumber } from '@/lib/formats';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

export const StatsCards = ({ stats }: { stats: TStats }) => {
    const cards = [
        {
            label: 'Clicks Count',
            value: formatNumber(stats.total_clicks),
            delta: stats.click_delta,
            sub: 'period trend',
        },
        { label: 'Active Links', value: stats.active_links, sub: `of ${stats.total_links} total` },
        {
            label: 'Disabled Links',
            value: stats.disabled_links || '—',
            sub: `of ${stats.total_links} total`,
        },
        { label: 'Expired Links', value: stats.expired_links || '—', sub: 'past expiry date' },
        { label: 'Unique Visitors', value: formatNumber(stats.unique_visitors), sub: 'by IP' },
        {
            label: 'Avg Daily Clicks',
            value: formatNumber(stats.avg_daily_clicks),
            sub: 'on active days',
        },
        { label: 'Peak Day', value: formatNumber(stats.peak_day), sub: 'single day best' },
        {
            label: 'Avg Clicks / Link',
            value: formatNumber(stats.avg_clicks_per_link),
            sub: 'this period',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {cards.map((s) => (
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
