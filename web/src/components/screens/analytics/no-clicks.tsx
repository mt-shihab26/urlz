import type { TNoClickLink } from '#/services/analytics';

import { formatCode, formatDate } from '#/lib/formats';
import { route } from '#/routes';
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

export const NoClicks = ({ links }: { links: TNoClickLink[] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>No Clicks Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    All active links have clicks
                                </TableCell>
                            </TableRow>
                        ) : (
                            links.map((link) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate({ to: route.linksShow(link.id) })}
                                >
                                    <TableCell>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            {formatCode(link.code)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                        {formatDate(link.created)}
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
