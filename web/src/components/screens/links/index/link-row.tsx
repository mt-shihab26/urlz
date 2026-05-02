import type { TLink } from '@/types/models';

import { formatCode, formatDate, formatNumber } from '@/lib/formats';
import { useNavigate } from 'react-router';

import { CopyButton } from '@/components/composite/copy-button';
import { StatusBadge } from '@/components/composite/urlz-ui';
import { TableCell, TableRow } from '@/components/ui/table';
import { LinkDeleteButton } from './link-delete-button';
import { LinkOpenButton } from './link-open-button';
import { LinkSparkline } from './link-sparkline';
import { LinkToggleButton } from './link-toggle-button';

export const LinkRow = ({ link }: { link: TLink }) => {
    const navigate = useNavigate();

    return (
        <TableRow className="group">
            <TableCell className="max-w-55">
                <div className="cursor-pointer" onClick={() => navigate(`/links/${link.id}`)}>
                    <div className="truncate font-medium">{link.title}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">
                        {link.url}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-primary">{formatCode(link.code)}</span>
                    <CopyButton text={formatCode(link.code)} />
                </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold">
                {formatNumber(link.clicks)}
            </TableCell>
            <TableCell className="text-right">
                <LinkSparkline series={link.series} />
            </TableCell>
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {formatDate(link.created)}
            </TableCell>
            <TableCell>
                <StatusBadge status={link.status} />
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <LinkToggleButton link={link} />
                    <LinkOpenButton link={link} />
                    <LinkDeleteButton link={link} />
                </div>
            </TableCell>
        </TableRow>
    );
};
