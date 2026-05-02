import { formatChartDate } from '@/lib/formats';
import type { TRange } from '@/lib/ranges';
import { getRangeStartDate } from '@/lib/ranges';
import type { TClick } from '@/types/models';
import { useEffect, useMemo, useState } from 'react';

import { Paginator } from '@/components/composite/paginator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const PAGE_SIZE = 10;

const getClickLabel = (value: string) => {
    return value.trim() || 'Direct';
};

export const LinkClicksTable = ({ clicks, range }: { clicks: TClick[]; range: TRange }) => {
    const [page, setPage] = useState(1);

    const filteredClicks = useMemo(() => {
        const cutoff = getRangeStartDate(range as TRange);
        return cutoff ? clicks.filter((click) => click.date >= cutoff) : clicks;
    }, [clicks, range]);

    const pageCount = Math.max(1, Math.ceil(filteredClicks.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);

    const paginatedClicks = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredClicks.slice(start, start + PAGE_SIZE);
    }, [currentPage, filteredClicks]);

    useEffect(() => {
        setPage(1);
    }, [range, clicks.length]);

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
                        {paginatedClicks.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No clicks found for this range
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedClicks.map((click, index) => (
                                <TableRow key={click.id}>
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {formatChartDate(click.date)}
                                    </TableCell>
                                    <TableCell>{getClickLabel(click.country_name)}</TableCell>
                                    <TableCell className="max-w-48 truncate">
                                        {getClickLabel(click.referrer)}
                                    </TableCell>
                                    <TableCell>{getClickLabel(click.browser)}</TableCell>
                                    <TableCell>{getClickLabel(click.os)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {filteredClicks.length > PAGE_SIZE && (
                    <div className="flex flex-col mt-2 gap-3 px-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="shrink-0 text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                            {Math.min(currentPage * PAGE_SIZE, filteredClicks.length)} of{' '}
                            {filteredClicks.length}
                        </p>
                        <Paginator
                            currentPage={currentPage}
                            totalPages={pageCount}
                            onPage={setPage}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
