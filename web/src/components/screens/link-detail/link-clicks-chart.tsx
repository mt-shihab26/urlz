import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
    clicks: { label: 'Clicks', color: 'var(--primary)' },
} satisfies ChartConfig;

type LinkClicksChartProps = {
    data: { date: string; clicks: number }[];
};

export const LinkClicksChart = ({ data }: LinkClicksChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
                <ChartContainer config={chartConfig} className="h-45 w-full">
                    <AreaChart data={data}>
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
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                    }
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
