import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TClick, TLink } from '@/types/models';

import { formatCode, formatNumber } from '@/lib/formats';
import { route } from '@/routes';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { LinkSparkline } from '@/components/screens/links/index/link-sparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TopPerforming = ({ links, clicks }: { links: TLink[]; clicks: TClick[] }) => {
    const navigate = useNavigate();

    const ranked = useMemo(() => {
        return [...links]
            .map((link) => {
                const linkClicks = clicks.filter((c) => c.link === link.id);
                const periodClicks = linkClicks.length;
                return { link, periodClicks, linkClicks };
            })
            .sort((a, b) => b.periodClicks - a.periodClicks)
            .slice(0, 10);
    }, [links, clicks]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing</CardTitle>
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
                            ranked.map(({ link, periodClicks, linkClicks }, i) => (
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
                                            {formatCode(link.code)}
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
