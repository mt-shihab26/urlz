import type { TLink } from '@/types/models';

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { formatNumber } from '@/lib/formats';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ClicksByLink = ({ links }: { links: TLink[] }) => {
    const navigate = useNavigate();
    const sorted = useMemo(() => [...links].sort((a, b) => b.clicks - a.clicks), [links]);
    const max = sorted[0]?.clicks ?? 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clicks by Link</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                            <TableHead className="w-40">Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    No links yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((link) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/links/${link.id}`)}
                                >
                                    <TableCell>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            urlz.io/{link.code}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {formatNumber(link.clicks)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${(link.clicks / max) * 100}%` }}
                                            />
                                        </div>
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
