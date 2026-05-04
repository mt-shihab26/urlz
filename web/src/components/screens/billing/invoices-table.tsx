import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TInvoice } from '@/collections/billing';

import { getInvoices } from '@/collections/billing';
import { formatAmount, formatLocaleDate } from '@/lib/formats';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    void: 'outline',
    uncollectible: 'destructive',
};

export const InvoicesTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [invoices, setInvoices] = useState<TInvoice[] | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                setInvoices(await getInvoices());
            } catch (e: any) {
                toastError(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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
                ) : invoices?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                ) : (
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
                            {invoices?.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono text-xs">
                                        {inv.number || inv.id.slice(-8)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatLocaleDate(inv.period_start)} –{' '}
                                        {formatLocaleDate(inv.period_end)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatAmount(inv.amount_paid, inv.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_VARIANT[inv.status] ?? 'outline'}>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {inv.hosted_invoice_url && (
                                                <Button variant="ghost" size="sm">
                                                    <a
                                                        href={inv.hosted_invoice_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View
                                                    </a>
                                                </Button>
                                            )}
                                            {inv.invoice_pdf && (
                                                <Button variant="ghost" size="sm">
                                                    <a
                                                        href={inv.invoice_pdf}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        PDF
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
