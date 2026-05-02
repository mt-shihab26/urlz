import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TClick } from '@/types/models';

import { formatNumber } from '@/lib/formats';
import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsReferrers = ({ clicks }: { clicks: TClick[] }) => {
    const referrers = useMemo(() => {
        const map = new Map<string, number>();
        clicks.forEach(({ referrer }) => {
            if (referrer) map.set(referrer, (map.get(referrer) ?? 0) + 1);
        });
        return Array.from(map.entries())
            .map(([source, clicks]) => ({ source, clicks }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [clicks]);

    return (
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
                        {referrers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No referrers yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            referrers.slice(0, 6).map((r) => (
                                <TableRow key={r.source}>
                                    <TableCell>{r.source}</TableCell>
                                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                                        {formatNumber(r.clicks)}
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
