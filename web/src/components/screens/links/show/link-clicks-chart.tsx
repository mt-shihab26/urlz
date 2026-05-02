import type { ChartConfig } from '@/components/ui/chart';
import type { TClick } from '@/types/models';
import type { TLinkDetailRange } from './link-detail-header';

import { clicksToSeries } from '@/lib/clicks';
import { formatChartDate } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig: ChartConfig = {
    clicks: { label: 'Clicks', color: 'var(--primary)' },
};

const cutoffDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
};

export const LinkClicksChart = ({
    range,
    clicks,
}: {
    range: TLinkDetailRange;
    clicks: TClick[];
}) => {
    const series = useMemo(() => {
        const cutoff =
            range === '7d'
                ? cutoffDate(7)
                : range === '90d'
                  ? cutoffDate(90)
                  : range === '30d'
                    ? cutoffDate(30)
                    : null;
        const filtered = cutoff ? clicks.filter((c) => c.date >= cutoff) : clicks;
        return clicksToSeries(filtered);
    }, [range, clicks]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
                <ChartContainer config={chartConfig} className="h-45 w-full">
                    <AreaChart data={series}>
                        <defs>
                            <linearGradient id="fillClicksDt" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-clicks)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-clicks)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={formatChartDate}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(v) => formatChartDate(String(v))}
                                />
                            }
                        />
                        <Area
                            dataKey="clicks"
                            type="natural"
                            fill="url(#fillClicksDt)"
                            stroke="var(--color-clicks)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
