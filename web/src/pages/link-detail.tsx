import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ChevronLeftIcon } from 'lucide-react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { StatusBadge, CountryBar } from '@/components/composite/urlz-ui';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
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
import { LINKS_DATA, COUNTRIES_DATA, REFERRERS_DATA } from '@/lib/urlz-data';

const chartConfig = {
    clicks: {
        label: 'Clicks',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

const RANGES = ['7d', '30d', '90d', 'All'] as const;
type Range = (typeof RANGES)[number];

function LinkDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [range, setRange] = React.useState<Range>('30d');

    const link = LINKS_DATA.find((l) => l.id === id);

    if (!link) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate('/links')}>
                        Back to Links
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const days =
        range === '7d' ? 7 : range === '90d' ? 90 : range === 'All' ? link.series.length : 30;
    const slicedSeries = link.series.slice(-days);
    const periodClicks = slicedSeries.reduce((s, d) => s + d.clicks, 0);
    const maxCountryPct = COUNTRIES_DATA[0].pct;

    const stats = [
        { label: 'Period Clicks', value: periodClicks.toLocaleString() },
        { label: 'Total Clicks', value: link.clicks.toLocaleString() },
        { label: 'Countries', value: '38' },
        {
            label: 'Created',
            value: new Date(link.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
            }),
        },
    ];

    return (
        <DashboardLayout>
            {/* Header section */}
            <div className="flex flex-col gap-2 border-b px-4 py-4 lg:px-6">
                <button
                    onClick={() => navigate('/links')}
                    className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeftIcon className="size-4" />
                    Back to Links
                </button>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight">{link.title}</h1>
                            <StatusBadge status={link.status} />
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="font-mono text-primary">urlz.io/{link.code}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                                {link.url}
                            </span>
                        </div>
                    </div>
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
                </div>
            </div>

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    {stats.map((s) => (
                        <Card key={s.label}>
                            <CardHeader className="pb-1">
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="font-mono text-2xl font-bold tabular-nums">
                                    {s.value}
                                </p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Click volume chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Clicks Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 pb-4">
                        <ChartContainer config={chartConfig} className="h-[180px] w-full">
                            <AreaChart data={slicedSeries}>
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
                                    fill="url(#fillClicksDt)"
                                    stroke="var(--color-clicks)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Countries + Referrers */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Countries</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2.5">
                            {COUNTRIES_DATA.slice(0, 6).map((d) => (
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
                                    {REFERRERS_DATA.slice(0, 6).map((r) => (
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
            </div>
        </DashboardLayout>
    );
}
export default LinkDetail;
