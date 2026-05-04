import type { TInvoice } from '@/collections/billing';
import type { PaginationState } from '@tanstack/react-table';

import { getInvoices } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { columns } from './columns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from './list';
import { Loading } from './loading';
import { Paginator } from './paginator';

export const Invoices = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [invoices, setInvoices] = useState<TInvoice[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 3 });

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
                    <Loading />
                ) : invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                ) : (
                    <>
                        <List table={table} />
                        <Paginator table={table} />
                    </>
                )}
            </CardContent>
        </Card>
    );
};
