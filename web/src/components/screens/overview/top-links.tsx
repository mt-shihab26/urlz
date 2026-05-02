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

import { LinkStatusBadge } from '@/components/composite/link-status-badge';
import { LinkSparkline } from '@/components/screens/links/index/link-sparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TopLinks = ({ links, clicks }: { links: TLink[]; clicks: TClick[] }) => {
    const navigate = useNavigate();
    const topLinks = useMemo(
        () =>
            [...links]
                .map((link) => ({
                    link,
                    linkClicks: clicks.filter((c) => c.link === link.id),
                }))
                .sort((a, b) => b.linkClicks.length - a.linkClicks.length)
                .slice(0, 6),
        [links, clicks],
    );

    return (
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
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topLinks.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No links yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            topLinks.map(({ link, linkClicks }, i) => (
                                <TableRow
                                    key={link.id}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(route.linksShow(link.id))}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                                                {i + 1}
                                            </span>
                                            <div>
                                                <div className="font-medium">{link.title}</div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-mono text-xs text-primary">
                                                        {formatCode(link.code)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {formatNumber(linkClicks.length)}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end">
                                        <LinkSparkline clicks={linkClicks} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <LinkStatusBadge link={link} />
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
