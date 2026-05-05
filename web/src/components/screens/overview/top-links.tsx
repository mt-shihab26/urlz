import type { TOverviewTopLink } from '@/services/overview';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatCode, formatNumber } from '@/lib/formats';
import { route } from '@/routes';
import { useNavigate } from 'react-router';

import { Sparkline } from '@/components/composite/sparkline';
import { StatusBadge } from '@/components/composite/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TopLinks = ({ topLinks }: { topLinks: TOverviewTopLink[] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Links</CardTitle>
            </CardHeader>
            <CardContent>
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
                            topLinks.map((link, i) => (
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
                                        {formatNumber(link.totalClicks)}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end">
                                        <Sparkline data={link.sparkline} width={64} height={22} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <StatusBadge
                                            status={
                                                link.expires && new Date(link.expires) < new Date()
                                                    ? 'expired'
                                                    : link.status
                                            }
                                        />
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
