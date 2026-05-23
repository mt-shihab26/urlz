import type { TClickRecord } from '#/services/links/show';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table';

import { formatChartDate } from '#/lib/formats';

import { Paginator } from '#/components/composite/paginator';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';

const PAGE_SIZE = 10;

const label = (value: string) => value.trim() || 'Direct';

export const ClicksTable = ({
    clicks,
    page,
    totalItems,
    totalPages,
    onPage,
}: {
    clicks: TClickRecord[];
    page: number;
    totalItems: number;
    totalPages: number;
    onPage: (page: number) => void;
}) => {
    const offset = (page - 1) * PAGE_SIZE;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Click History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Referrer</TableHead>
                            <TableHead>Browser</TableHead>
                            <TableHead>OS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clicks.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No clicks found for this range
                                </TableCell>
                            </TableRow>
                        ) : (
                            clicks.map((click, index) => (
                                <TableRow key={click.id}>
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                        {offset + index + 1}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {formatChartDate(click.date)}
                                    </TableCell>
                                    <TableCell>{label(click.country_name)}</TableCell>
                                    <TableCell className="max-w-48 truncate">
                                        {label(click.referrer)}
                                    </TableCell>
                                    <TableCell>{label(click.browser)}</TableCell>
                                    <TableCell>{label(click.os)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {totalPages > 1 && (
                    <div className="mt-2 flex flex-col gap-3 px-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="shrink-0 text-sm text-muted-foreground">
                            Showing {offset + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of{' '}
                            {totalItems}
                        </p>
                        <Paginator currentPage={page} totalPages={totalPages} onPage={onPage} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
