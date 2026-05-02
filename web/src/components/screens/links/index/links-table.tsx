import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { TLink } from '@/types/models';

import { LinkRow } from '@/components/screens/links/index/link-row';

export const LinksTable = ({ links }: { links: TLink[] }) => {
    return (
        <div className="overflow-hidden border">
            <Table>
                <TableHeader>
                    <TableRow>
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
                                colSpan={8}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No links found
                            </TableCell>
                        </TableRow>
                    ) : (
                        links.map((link) => <LinkRow key={link.id} link={link} />)
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
