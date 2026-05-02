import type { ChartConfig } from '@/components/ui/chart';
import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { formatChartDate, formatNumber } from '@/lib/formats';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig: ChartConfig = {
    clicks: { label: 'Clicks', color: 'var(--primary)' },
};

export const ClickVolumeChart = ({ links, range }: { links: TLink[]; range: TRange }) => {
    const { series, curr30 } = useMemo(() => {
        const byDate = new Map<string, number>();
        links.forEach((link) =>
            link.series.forEach(({ date, clicks }) =>
                byDate.set(date, (byDate.get(date) ?? 0) + clicks),
            ),
        );
        const totalSeries = Array.from(byDate.entries())
            .map(([date, clicks]) => ({ date, clicks }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const sliced =
            range === '7d'
                ? totalSeries.slice(-7)
                : range === '30d'
                  ? totalSeries.slice(-30)
                  : range === '90d'
                    ? totalSeries.slice(-90)
                    : totalSeries;

        return {
            series: sliced,
            curr30: totalSeries.slice(-30).reduce((s, d) => s + d.clicks, 0),
        };
    }, [links, range]);

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Click Volume</CardTitle>
                    <CardDescription className="mt-0.5 font-mono text-xs">
                        {formatNumber(curr30)} this period
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
                <ChartContainer config={chartConfig} className="h-50 w-full">
                    <AreaChart data={series}>
                        <defs>
                            <linearGradient id="fillClicksOv" x1="0" y1="0" x2="0" y2="1">
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
                            content={<ChartTooltipContent labelFormatter={formatChartDate} />}
                        />
                        <Area
                            dataKey="clicks"
                            type="natural"
                            fill="url(#fillClicksOv)"
                            stroke="var(--color-clicks)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
