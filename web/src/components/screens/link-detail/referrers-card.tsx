import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReferrerData = {
    source: string;
    clicks: number;
};

export const ReferrersCard = ({ referrers }: { referrers: ReferrerData[] }) => {
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
                        {referrers.slice(0, 6).map((referrer) => (
                            <TableRow key={referrer.source}>
                                <TableCell>{referrer.source}</TableCell>
                                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                                    {referrer.clicks.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
