import type { TLink } from '@/types/models';

import { deleteLink, toggleLinkStatus } from '@/collections/links';
import { formatCode, formatDate, formatNumber } from '@/lib/formats';
import { toastError } from '@/lib/toast';
import { useNavigate } from 'react-router';

import { CopyButton } from '@/components/composite/copy-button';
import { Sparkline, StatusBadge } from '@/components/composite/urlz-ui';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { ExternalLinkIcon, EyeIcon, EyeOffIcon, Trash2Icon } from 'lucide-react';

export const LinkRow = ({ link }: { link: TLink }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/links/${link.id}`);
    };

    const handleLinkToggle = async () => {
        try {
            await toggleLinkStatus(link.id, link.status);
        } catch (e) {
            toastError(e instanceof Error ? e.message : 'Failed to toggle link status');
        }
    };

    return (
        <TableRow className="group">
            <TableCell className="max-w-55">
                <div className="cursor-pointer" onClick={handleClick}>
                    <div className="truncate font-medium">{link.title}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">
                        {link.url}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-primary">{formatCode(link.code)}</span>
                    <CopyButton text={link.code} />
                </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold">
                {formatNumber(link.clicks)}
            </TableCell>
            <TableCell className="text-right">
                <Sparkline data={link.series.slice(-14)} width={64} height={22} />
            </TableCell>
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {formatDate(link.created)}
            </TableCell>
            <TableCell>
                <StatusBadge status={link.status} />
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title={link.status === 'active' ? 'Disable' : 'Enable'}
                        onClick={handleLinkToggle}
                    >
                        {link.status === 'active' ? (
                            <EyeOffIcon className="size-3.5" />
                        ) : (
                            <EyeIcon className="size-3.5" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => window.open(link.url, '_blank')}
                        title="Open"
                    >
                        <ExternalLinkIcon className="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => deleteLink(link.id)}
                        title="Delete"
                    >
                        <Trash2Icon className="size-3.5" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};
