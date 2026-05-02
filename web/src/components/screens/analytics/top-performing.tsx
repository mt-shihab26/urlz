import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { formatNumber } from '@/lib/formats';
import { route } from '@/routes';

import { LinkSparkline } from '@/components/screens/links/index/link-sparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const rangeDays: Record<TRange, number | null> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    All: null,
};

export const TopPerforming = ({ links, range }: { links: TLink[]; range: TRange }) => {
    const navigate = useNavigate();

    const ranked = useMemo(() => {
        const days = rangeDays[range];
        return [...links]
            .map((link) => {
                const sliced = days ? link.series.slice(-days) : link.series;
                const periodClicks = sliced.reduce((s, d) => s + d.clicks, 0);
                return { link, periodClicks };
            })
            .sort((a, b) => b.periodClicks - a.periodClicks)
            .slice(0, 10);
    }, [links, range]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing ({range})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Period Clicks</TableHead>
                            <TableHead className="text-right">Trend</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ranked.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No data yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            ranked.map(({ link, periodClicks }, i) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(route.linksShow(link.id))}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground w-8">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            urlz.io/{link.code}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {formatNumber(periodClicks)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <LinkSparkline series={link.series} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
