import {
    CheckIcon,
    CopyIcon,
    ExternalLinkIcon,
    EyeIcon,
    EyeOffIcon,
    Trash2Icon,
} from 'lucide-react';

import type { TLink } from '@/types/models';

import { deleteLink, toggleLinkStatus } from '@/collections/links';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

import { Sparkline, StatusBadge } from '@/components/composite/urlz-ui';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

export const LinkRow = ({ link }: { link: TLink }) => {
    const navigate = useNavigate();

    const [copiedText, handleCopy] = useCopyToClipboard();

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
                    <span className="font-mono text-xs text-primary">urlz.io/{link.code}</span>
                    <button
                        onClick={() => handleCopy(link.code)}
                        className={cn(
                            'rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground',
                            copiedText === link.code &&
                                'text-green-600 dark:text-green-400 opacity-100',
                        )}
                    >
                        {copiedText === link.code ? (
                            <CheckIcon className="size-3" />
                        ) : (
                            <CopyIcon className="size-3" />
                        )}
                    </button>
                </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold">
                {link.clicks.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
                <Sparkline data={link.series.slice(-14)} width={64} height={22} />
            </TableCell>
            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {new Date(link.created).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })}
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
                        onClick={() => toggleLinkStatus(link.id, link.status)}
                        title={link.status === 'active' ? 'Disable' : 'Enable'}
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
