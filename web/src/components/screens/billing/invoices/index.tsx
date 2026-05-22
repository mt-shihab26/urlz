import type { TInvoice } from '#/collections/billing';
import type { PaginationState } from '@tanstack/react-table';

import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { columns } from './columns';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { List } from './list';
import { Paginator } from './paginator';

export const Invoices = ({ invoices }: { invoices: TInvoice[] }) => {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

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
                {table.getRowCount() === 0 ? (
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
