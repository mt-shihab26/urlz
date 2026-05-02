import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatNumber } from '@/lib/formats';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TLinkReferrer } from '@/types/models';

export const ReferrersCard = ({ referrers }: { referrers: TLinkReferrer[] }) => {
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
                            referrers.slice(0, 6).map((referrer) => (
                                <TableRow key={referrer.source}>
                                    <TableCell>{referrer.source}</TableCell>
                                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                                        {formatNumber(referrer.clicks)}
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
