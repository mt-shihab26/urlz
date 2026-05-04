import type { TInvoice } from '@/collections/billing';
import type { ColumnDef } from '@tanstack/react-table';

import { buttonVariants } from '@/components/ui/button';
import { formatAmount, formatLocaleDate } from '@/lib/formats';

import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    void: 'outline',
    uncollectible: 'destructive',
};

export const columns: ColumnDef<TInvoice>[] = [
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
