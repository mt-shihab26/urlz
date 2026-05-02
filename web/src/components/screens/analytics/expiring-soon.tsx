import type { TLink } from '@/types/models';

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { formatDate } from '@/lib/formats';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ExpiringSoon = ({ links }: { links: TLink[] }) => {
    const navigate = useNavigate();

    const expiring = useMemo(() => {
        const now = Date.now();
        const in30Days = now + 30 * 24 * 60 * 60 * 1000;
        return links
            .filter((l) => l.expires && new Date(l.expires).getTime() > now && new Date(l.expires).getTime() <= in30Days)
            .sort((a, b) => new Date(a.expires).getTime() - new Date(b.expires).getTime());
    }, [links]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8 text-center">#</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Expires</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expiring.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    No links expiring in the next 30 days
                                </TableCell>
                            </TableRow>
                        ) : (
                            expiring.map((link, i) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/dashboard/links/${link.id}`)}
                                >
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            urlz.io/{link.code}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-destructive">
                                        {formatDate(link.expires)}
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
