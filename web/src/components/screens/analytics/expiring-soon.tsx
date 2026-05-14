import type { TExpiringLink } from '#/services/analytics';

import { formatCode, formatDate } from '#/lib/formats';
import { route } from '#/lib/route';
import { useNavigate } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table';

export const ExpiringSoon = ({ links }: { links: TExpiringLink[] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8 text-center">#</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Expires</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No links expiring in the next 30 days
                                </TableCell>
                            </TableRow>
                        ) : (
                            links.map((link, i) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate({ to: route.linksShow(link.id) })}
                                >
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            {formatCode(link.code)}
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
