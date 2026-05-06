import type { TTopLink } from '@/services/analytics';

import { formatCode, formatNumber } from '@/lib/formats';
import { route } from '@/routes';
import { useNavigate } from 'react-router';

import { Sparkline } from '@/components/composite/sparkline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const TopPerforming = ({ topLinks }: { topLinks: TTopLink[] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing</CardTitle>
            </CardHeader>
            <CardContent>
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
                        {topLinks.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No data yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            topLinks.map((link, i) => (
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
                                        {formatNumber(link.total_clicks)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Sparkline data={link.sparkline} width={64} height={22} />
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
