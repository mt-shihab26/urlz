import type { TLinkItem } from '@/services/links';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { LinkRow } from '@/components/screens/links/index/link-row';

export const LinksTable = ({ links }: { links: TLinkItem[] }) => {
    return (
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
                        links.map((link, i) => <LinkRow key={link.id} link={link} index={i} />)
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
