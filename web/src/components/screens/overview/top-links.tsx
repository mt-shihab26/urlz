import { useMemo } from 'react';

import { useNavigate } from 'react-router';

import { Sparkline } from '@/components/composite/sparkline';
import { StatusBadge } from '@/components/composite/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { TLink } from '@/types/models';

export const TopLinks = ({ links }: { links: TLink[] }) => {
    const navigate = useNavigate();
    const topLinks = useMemo(
        () => [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 6),
        [links],
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
                            <TableHead>Status</TableHead>
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
                                        <Sparkline
                                            data={link.series.slice(-14)}
                                            width={72}
                                            height={24}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={link.status} />
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
