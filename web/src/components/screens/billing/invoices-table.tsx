import type { TInvoice } from '@/collections/billing';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fmt = (ts: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

const fmtAmount = (cents: number, currency: string) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    void: 'outline',
    uncollectible: 'destructive',
};

export const InvoicesTable = ({ invoices }: { invoices: TInvoice[] }) => {
    if (invoices.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                        {invoices.map((inv) => (
                            <TableRow key={inv.id}>
                                <TableCell className="font-mono text-xs">{inv.number || inv.id.slice(-8)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                    {fmt(inv.period_start)} – {fmt(inv.period_end)}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {fmtAmount(inv.amount_paid, inv.currency)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={STATUS_VARIANT[inv.status] ?? 'outline'}>
                                        {inv.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {inv.hosted_invoice_url && (
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={inv.hosted_invoice_url} target="_blank" rel="noreferrer">
                                                    View
                                                </a>
                                            </Button>
                                        )}
                                        {inv.invoice_pdf && (
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={inv.invoice_pdf} target="_blank" rel="noreferrer">
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
            </CardContent>
        </Card>
    );
};
