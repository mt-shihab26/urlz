import * as React from 'react';
import { useNavigate } from 'react-router';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Header } from '@/components/composite/site-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LINKS_DATA, TOTAL_SERIES } from '@/lib/urlz-data';
import { StatusBadge, Sparkline } from '@/components/composite/urlz-ui';

const chartConfig = {
    clicks: {
        label: 'Clicks',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

const RANGES = ['7d', '30d', '90d', 'All'] as const;
type Range = (typeof RANGES)[number];

function getSlice(range: Range) {
    const len = TOTAL_SERIES.length;
    if (range === '7d') return TOTAL_SERIES.slice(-7);
    if (range === '30d') return TOTAL_SERIES.slice(-30);
    if (range === '90d') return TOTAL_SERIES.slice(-Math.min(90, len));
    return TOTAL_SERIES;
}

function Overview() {
    const navigate = useNavigate();
    const [range, setRange] = React.useState<Range>('30d');
    const slicedSeries = getSlice(range);

    const totalClicks = TOTAL_SERIES.reduce((s, d) => s + d.clicks, 0);
    const prevClicks = TOTAL_SERIES.slice(-60, -30).reduce((s, d) => s + d.clicks, 0);
    const currClicks = TOTAL_SERIES.slice(-30).reduce((s, d) => s + d.clicks, 0);
    const delta = prevClicks > 0 ? Math.round(((currClicks - prevClicks) / prevClicks) * 100) : 0;
    const activeLinks = LINKS_DATA.filter((l) => l.status === 'active').length;

    const stats = [
        {
            label: 'Total Clicks',
            value: totalClicks.toLocaleString(),
            delta,
            sub: 'vs prev 30d',
        },
        {
            label: 'Active Links',
            value: activeLinks,
            sub: `of ${LINKS_DATA.length} total`,
        },
        {
            label: 'Avg Clicks / Link',
            value: Math.round(totalClicks / LINKS_DATA.length).toLocaleString(),
            sub: 'lifetime',
        },
        { label: 'Countries', value: '43', delta: 8, sub: 'reached' },
    ];

    return (
        <DashboardLayout title="Overview">
            <Header
                title="Overview"
                description="April 28, 2026 — all your links at a glance"
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
                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((s) => (
                        <Card key={s.label}>
                            <CardHeader className="pb-2">
                                <CardDescription>{s.label}</CardDescription>
                                <CardTitle className="text-3xl font-bold tabular-nums">
                                    {s.value}
                                </CardTitle>
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
                                {s.sub && (
                                    <span className="text-muted-foreground">{s.sub}</span>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Click volume chart */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Click Volume</CardTitle>
                            <CardDescription className="mt-0.5 font-mono text-xs">
                                {currClicks.toLocaleString()} this period
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pb-4">
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <AreaChart data={slicedSeries}>
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
                                    fill="url(#fillClicksOv)"
                                    stroke="var(--color-clicks)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Top links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Links</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Link</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                    <TableHead className="text-right">Trend</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {LINKS_DATA.slice(0, 6).map((link, i) => (
                                    <TableRow
                                        key={link.id}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/links/${link.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <div className="font-medium">{link.title}</div>
                                                    <div className="font-mono text-xs text-muted-foreground">
                                                        urlz.io/{link.code}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold">
                                            {link.clicks.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Sparkline data={link.series.slice(-14)} width={72} height={24} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={link.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
export default Overview;
