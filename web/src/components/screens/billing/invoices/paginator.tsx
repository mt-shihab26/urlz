import type { TInvoice } from '@/collections/billing';
import type { Table as TTable } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

export const Paginator = ({ table }: { table: TTable<TInvoice> }) => {
    return (
        <>
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-end gap-2 pt-4">
                    <span className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
    );
};
