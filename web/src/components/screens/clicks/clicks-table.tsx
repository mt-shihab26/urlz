import type { TClicksPage } from '@/collections/clicks';
import type { TClick, TLink } from '@/types/models';

import { Paginator } from '@/components/composite/paginator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatChartDate } from '@/lib/formats';

export const PER_PAGE = 20;

const getClickLabel = (value: string) => value?.trim() || '—';

type Props = {
    result: TClicksPage | null;
    links: TLink[];
    loading: boolean;
    page: number;
    onPage: (p: number) => void;
    onClickRow: (click: TClick) => void;
};

export const ClicksTable = ({ result, links, loading, page, onPage, onClickRow }: Props) => {
    const linkMap = new Map(links.map((l) => [l.id, l]));

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
                                    <div className="font-medium">
                                        {linkMap.get(click.link)?.title ?? '—'}
                                    </div>
                                    <div className="font-mono text-xs text-primary">
                                        {linkMap.get(click.link)?.code ?? click.link}
                                    </div>
                                </TableCell>
                                <TableCell>{getClickLabel(click.country_name)}</TableCell>
                                <TableCell className="capitalize">
                                    {getClickLabel(click.device)}
                                </TableCell>
                                <TableCell>{getClickLabel(click.browser)}</TableCell>
                                <TableCell>{getClickLabel(click.os)}</TableCell>
                                <TableCell className="max-w-40 truncate">
                                    {getClickLabel(click.referrer)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {result && result.totalItems > PER_PAGE && (
                <div className="flex flex-col mt-2 gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="shrink-0 text-sm text-muted-foreground">
                        Showing {(page - 1) * PER_PAGE + 1}–
                        {Math.min(page * PER_PAGE, result.totalItems)} of {result.totalItems}
                    </p>
                    <Paginator currentPage={page} totalPages={result.totalPages} onPage={onPage} />
                </div>
            )}
        </div>
    );
};
