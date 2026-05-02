import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TClick, TLink } from '@/types/models';

import { formatCode, formatDate } from '@/lib/formats';
import { isLinkActive } from '@/lib/links';
import { route } from '@/routes';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NoClicks = ({ links, clicks }: { links: TLink[]; clicks: TClick[] }) => {
    const navigate = useNavigate();

    const dead = useMemo(() => {
        const clickedIds = new Set(clicks.map((c) => c.link));
        return links
            .filter((l) => isLinkActive(l) && !clickedIds.has(l.id))
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    }, [links, clicks]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>No Clicks Yet</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dead.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    All active links have clicks
                                </TableCell>
                            </TableRow>
                        ) : (
                            dead.map((link) => (
                                <TableRow
                                    key={link.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(route.linksShow(link.id))}
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
