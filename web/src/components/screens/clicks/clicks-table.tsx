import type { TClickItem, TResponse } from '#/services/clicks';

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
import { Skeleton } from '#/components/ui/skeleton';

export const PER_PAGE = 20;

const label = (value: string) => value?.trim() || '—';

export const ClicksTable = ({
    result,
    loading,
    page,
    onPage,
    onClickRow,
}: {
    result: TResponse | null;
    loading: boolean;
    page: number;
    onPage: (p: number) => void;
    onClickRow: (click: TClickItem) => void;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10 text-center">#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Browser</TableHead>
                        <TableHead>OS</TableHead>
                        <TableHead>Referrer</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: PER_PAGE }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 8 }).map((__, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : !result || result.items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No clicks found
                            </TableCell>
                        </TableRow>
                    ) : (
                        result.items.map((click, i) => (
                            <TableRow
                                key={click.id}
                                className="cursor-pointer"
                                onClick={() => onClickRow(click)}
                            >
                                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                    {(page - 1) * PER_PAGE + i + 1}
                                </TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {formatChartDate(click.date)}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{click.link_title || '—'}</div>
                                    <div className="font-mono text-xs text-primary">
                                        {click.link_code}
                                    </div>
                                </TableCell>
                                <TableCell>{label(click.country_name)}</TableCell>
                                <TableCell className="capitalize">{label(click.device)}</TableCell>
                                <TableCell>{label(click.browser)}</TableCell>
                                <TableCell>{label(click.os)}</TableCell>
                                <TableCell className="max-w-40 truncate">
                                    {label(click.referrer)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {result && result.total_items > PER_PAGE && (
                <div className="mt-2 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="shrink-0 text-sm text-muted-foreground">
                        Showing {(page - 1) * PER_PAGE + 1}–
                        {Math.min(page * PER_PAGE, result.total_items)} of {result.total_items}
                    </p>
                    <Paginator currentPage={page} totalPages={result.total_pages} onPage={onPage} />
                </div>
            )}
        </div>
    );
};
