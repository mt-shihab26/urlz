import type { TLink } from '@/types/models';

import { formatCode, formatDate, formatNumber } from '@/lib/formats';
import { isLinkExpired } from '@/lib/links';
import { useNavigate } from 'react-router';

import { LinkDeleteButton } from '@/components/screens/links/link-delete-button';
import { LinkEditButton } from '@/components/screens/links/link-edit-button';
import { LinkOpenButton } from '@/components/screens/links/link-open-button';
import { LinkToggleButton } from '@/components/screens/links/link-toggle-button';

import { CopyButton } from '@/components/composite/copy-button';
import { StatusBadge } from '@/components/composite/status-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { LinkSparkline } from './link-sparkline';

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
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {link.expires ? formatDate(link.expires) : '—'}
            </TableCell>
            <TableCell className="text-right">
                <StatusBadge status={isLinkExpired(link) ? 'expired' : link.status} />
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <LinkEditButton link={link} />
                    <LinkToggleButton link={link} />
                    <LinkOpenButton link={link} />
                    <LinkDeleteButton link={link} />
                </div>
            </TableCell>
        </TableRow>
    );
};
