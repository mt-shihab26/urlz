import type { TLinkItem } from '#/services/links';

import { Paginator } from '#/components/composite/paginator';
import { LinkRow } from '#/components/screens/links/index/link-row';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table';

export const PER_PAGE = 20;

export const LinksTable = ({
    links,
    page,
    totalItems,
    totalPages,
    onPage,
}: {
    links: TLinkItem[];
    page: number;
    totalItems: number;
    totalPages: number;
    onPage: (p: number) => void;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead>Short URL</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                            <TableHead className="text-right">Trend</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                            <TableHead className="text-right">Expires</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No links found
                                </TableCell>
                            </TableRow>
                        ) : (
                            links.map((link, i) => (
                                <LinkRow
                                    key={link.id}
                                    link={link}
                                    index={(page - 1) * PER_PAGE + i}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {totalItems > PER_PAGE && (
                <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="shrink-0 text-sm text-muted-foreground">
                        Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalItems)}{' '}
                        of {totalItems}
                    </p>
                    <Paginator currentPage={page} totalPages={totalPages} onPage={onPage} />
                </div>
            )}
        </div>
    );
};
