import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { formatNumber } from '@/lib/formats';
import { route } from '@/routes';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { LinkSparkline } from '@/components/screens/links/index/link-sparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const rangeDays: Record<TRange, number | null> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    All: null,
};

const cutoffDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
};

export const TopPerforming = ({
    links,
    clicks,
    range,
}: {
    links: TLink[];
    clicks: TClick[];
    range: TRange;
}) => {
    const navigate = useNavigate();

    const ranked = useMemo(() => {
        const days = rangeDays[range];
        const cutoff = days ? cutoffDate(days) : null;
        return [...links]
            .map((link) => {
                const linkClicks = clicks.filter((c) => c.link === link.id);
                const periodClicks = cutoff
                    ? linkClicks.filter((c) => c.date >= cutoff).length
                    : linkClicks.length;
                return { link, periodClicks, linkClicks };
            })
            .sort((a, b) => b.periodClicks - a.periodClicks)
            .slice(0, 10);
    }, [links, clicks, range]);

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
                                        <LinkSparkline clicks={linkClicks} />
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
