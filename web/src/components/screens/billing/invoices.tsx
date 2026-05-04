import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TInvoice } from '@/collections/billing';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';

import { getInvoices } from '@/collections/billing';
import { buttonVariants } from '@/components/ui/button';
import { formatAmount, formatLocaleDate } from '@/lib/formats';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 10;

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    void: 'outline',
    uncollectible: 'destructive',
};

const columns: ColumnDef<TInvoice>[] = [
    {
        accessorKey: 'number',
        header: 'Invoice',
        cell: ({ row }) => (
            <span className="font-mono text-xs">
                {row.original.number || row.original.id.slice(-8)}
            </span>
        ),
    },
    {
        id: 'period',
        header: 'Period',
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatLocaleDate(row.original.period_start)} –{' '}
                {formatLocaleDate(row.original.period_end)}
            </span>
        ),
    },
    {
        id: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {formatAmount(row.original.amount_paid, row.original.currency)}
            </span>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={STATUS_VARIANT[row.original.status] ?? 'outline'}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Download</div>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {row.original.hosted_invoice_url && (
                    <a
                        href={row.original.hosted_invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                    >
                        View
                    </a>
                )}
                {row.original.invoice_pdf && (
                    <a
                        href={row.original.invoice_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                    >
                        PDF
                    </a>
                )}
            </div>
        ),
    },
];

export const Invoices = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [invoices, setInvoices] = useState<TInvoice[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    useEffect(() => {
        (async () => {
            try {
                setInvoices(await getInvoices());
            } catch (e: any) {
                toastError(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const table = useReactTable({
        data: invoices,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Download</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-12 rounded-full" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-12" />
                                            <Skeleton className="h-8 w-10" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {table.getPageCount() > 1 && (
                            <div className="flex items-center justify-end gap-2 pt-4">
                                <span className="text-sm text-muted-foreground">
                                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                                    {table.getPageCount()}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
