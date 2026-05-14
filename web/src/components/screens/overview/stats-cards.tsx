import { formatNumber } from '#/lib/formats';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

type Props = {
    totalClicks: number;
    activeLinks: number;
    totalLinks: number;
    uniqueVisitors: number;
    avgDailyClicks: number;
    clickDelta: number;
};

export const StatsCards = ({
    totalClicks,
    activeLinks,
    totalLinks,
    uniqueVisitors,
    avgDailyClicks,
    clickDelta,
}: Props) => {
    const stats = [
        {
            label: 'Total Clicks',
            value: formatNumber(totalClicks),
            delta: clickDelta,
            sub: 'vs prev 30d',
        },
        {
            label: 'Active Links',
            value: activeLinks,
            sub: `of ${totalLinks} total`,
        },
        {
            label: 'Unique Visitors',
            value: formatNumber(uniqueVisitors),
            sub: 'by IP',
        },
        {
            label: 'Avg Daily Clicks',
            value: formatNumber(avgDailyClicks),
            sub: 'on active days',
        },
    ];

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
