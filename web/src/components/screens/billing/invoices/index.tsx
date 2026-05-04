import type { PaginationState } from '@tanstack/react-table';

import { getInvoices } from '@/collections/billing';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { columns } from './columns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from './list';
import { Loading } from './loading';
import { Paginator } from './paginator';

export const Invoices = () => {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.invoices,
        queryFn: getInvoices,
        throwOnError: (e) => toastError(e),
    });

    const table = useReactTable({
        data: data || [],
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
                {isLoading ? (
                    <Loading />
                ) : table.getRowCount() === 0 ? (
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
