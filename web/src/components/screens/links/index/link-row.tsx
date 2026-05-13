import type { TLinkItem } from '@/services/links';

import { formatCode, formatDate, formatNumber } from '@/lib/formats';
import { route } from '@/routes';
import { useNavigate } from 'react-router';

import { CopyButton } from '@/components/composite/copy-button';
import { LinkStatusBadge } from '@/components/composite/link-status-badge';
import { LinkDeleteButton } from '@/components/screens/links/link-delete-button';
import { LinkEditButton } from '@/components/screens/links/link-edit-button';
import { LinkOpenButton } from '@/components/screens/links/link-open-button';
import { LinkToggleButton } from '@/components/screens/links/link-toggle-button';
import { TableCell, TableRow } from '@/components/ui/table';
import { LinkSparkline } from './link-sparkline';

export const LinkRow = ({ link, index }: { link: TLinkItem; index: number }) => {
    const navigate = useNavigate();

    return (
        <TableRow className="group">
            <TableCell className="w-10 text-center font-mono text-xs text-muted-foreground">
                {index + 1}
            </TableCell>
            <TableCell className="max-w-55">
                <div className="cursor-pointer" onClick={() => navigate(route.linksShow(link.id))}>
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
                {formatNumber(link.total_clicks)}
            </TableCell>
            <TableCell className="text-right">
                <LinkSparkline sparkline={link.sparkline} />
            </TableCell>
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {formatDate(link.created)}
            </TableCell>
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {link.expires ? formatDate(link.expires) : '—'}
            </TableCell>
            <TableCell className="text-right">
                <LinkStatusBadge link={link} />
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
