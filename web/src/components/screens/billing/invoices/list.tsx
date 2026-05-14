import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table';

import type { TInvoice } from '#/collections/billing';
import type { Table as TTable } from '@tanstack/react-table';

import { flexRender } from '@tanstack/react-table';

export const List = ({ table }: { table: TTable<TInvoice> }) => {
    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                            <TableHead key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
