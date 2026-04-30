import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Header } from '@/components/composite/site-header';
import { CountryBar } from '@/components/composite/urlz-ui';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const chartConfig = {
    clicks: { label: 'Clicks', color: 'var(--primary)' },
} satisfies ChartConfig;

const RANGES = ['7d', '30d', '90d', 'All'] as const;
type Range = (typeof RANGES)[number];

const totalSeries: { date: string; clicks: number }[] = [];
const countriesData: { country: string; code: string; clicks: number; pct: number }[] = [];
const referrersData: { source: string; clicks: number }[] = [];
const browsersData: { name: string; pct: number; color: string }[] = [];
const osData: { name: string; pct: number; color: string }[] = [];

function Analytics() {
    const [range, setRange] = React.useState<Range>('30d');

    const slicedSeries =
        range === '7d'
            ? totalSeries.slice(-7)
            : range === '30d'
              ? totalSeries.slice(-30)
              : range === '90d'
                ? totalSeries.slice(-90)
                : totalSeries;

    const maxCountryPct = countriesData[0]?.pct ?? 100;

    return (
        <DashboardLayout title="Analytics">
            <Header
                title="Analytics"
                description="Aggregated traffic across all links"
                action={
                    <ToggleGroup
                        multiple={false}
                        value={range ? [range] : []}
                        onValueChange={(v) => setRange((v[0] as Range) ?? '30d')}
                        variant="outline"
                        size="sm"
                    >
                        {RANGES.map((r) => (
                            <ToggleGroupItem key={r} value={r}>
                                {r}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                }
            />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Click Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 pb-4">
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <AreaChart data={slicedSeries}>
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
                                    tickFormatter={(v) =>
                                        new Date(v).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                    }
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(v) =>
                                                new Date(v).toLocaleDateString('en-US', {
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
                                    fill="url(#fillClicksAn)"
                                    stroke="var(--color-clicks)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Countries</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2.5">
                            {countriesData.map((d) => (
                                <CountryBar
                                    key={d.code}
                                    code={d.code}
                                    pct={d.pct}
                                    max={maxCountryPct}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Referrers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Source</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrersData.map((r) => (
                                        <TableRow key={r.source}>
                                            <TableCell>{r.source}</TableCell>
                                            <TableCell className="text-right font-mono text-sm text-muted-foreground">
                                                {r.clicks.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Browsers</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {browsersData.map((d) => (
                                <div key={d.name} className="flex items-center gap-2.5">
                                    <span
                                        className="size-2.5 shrink-0 rounded-sm"
                                        style={{ background: d.color }}
                                    />
                                    <span className="flex-1 text-sm">{d.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {d.pct}%
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Operating Systems</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {osData.map((d) => (
                                <div key={d.name} className="flex items-center gap-2.5">
                                    <span
                                        className="size-2.5 shrink-0 rounded-sm"
                                        style={{ background: d.color }}
                                    />
                                    <span className="flex-1 text-sm">{d.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {d.pct}%
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
export default Analytics;
