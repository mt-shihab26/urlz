import type { ChartConfig } from '@/components/ui/chart';
import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { formatChartDate } from '@/lib/formats';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig: ChartConfig = {
    clicks: { label: 'Clicks', color: 'var(--primary)' },
};

export const AnalyticsChart = ({ links, range }: { links: TLink[]; range: TRange }) => {
    const sliced = useMemo(() => {
        const byDate = new Map<string, number>();
        links.forEach((link) =>
            link.series.forEach(({ date, clicks }) =>
                byDate.set(date, (byDate.get(date) ?? 0) + clicks),
            ),
        );
        const total = Array.from(byDate.entries())
            .map(([date, clicks]) => ({ date, clicks }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return range === '7d'
            ? total.slice(-7)
            : range === '30d'
              ? total.slice(-30)
              : range === '90d'
                ? total.slice(-90)
                : total;
    }, [links, range]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Click Volume</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
                <ChartContainer config={chartConfig} className="h-50 w-full">
                    <AreaChart data={sliced}>
                        <defs>
                            <linearGradient id="fillClicksAn" x1="0" y1="0" x2="0" y2="1">
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
                            fill="url(#fillClicksAn)"
                            stroke="var(--color-clicks)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
