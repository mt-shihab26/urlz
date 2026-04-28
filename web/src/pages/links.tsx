import * as React from 'react';
import { useNavigate } from 'react-router';
import {
    CheckIcon,
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    ExternalLinkIcon,
    Trash2Icon,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Header } from '@/components/composite/site-header';
import { CreateLinkButton } from '@/components/composite/create-link-dialog';
import { StatusBadge, Sparkline } from '@/components/composite/urlz-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LINKS_DATA, type LinkStatus, type UrlzLink } from '@/lib/urlz-data';
import { cn } from '@/lib/utils';

type Filter = 'all' | LinkStatus;

export function Links() {
    const navigate = useNavigate();
    const [links, setLinks] = React.useState(LINKS_DATA);
    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<Filter>('all');
    const [copied, setCopied] = React.useState<string | null>(null);

    const filtered = links.filter((l) => {
        const matchSearch =
            !search ||
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.code.includes(search) ||
            l.url.includes(search);
        const matchFilter = filter === 'all' || l.status === filter;
        return matchSearch && matchFilter;
    });

    const counts = {
        all: links.length,
        active: links.filter((l) => l.status === 'active').length,
        disabled: links.filter((l) => l.status === 'disabled').length,
        expired: links.filter((l) => l.status === 'expired').length,
    };

    const toggleStatus = (id: string) =>
        setLinks((prev) =>
            prev.map((l) =>
                l.id === id
                    ? { ...l, status: l.status === 'active' ? 'disabled' : 'active' }
                    : l,
            ) as UrlzLink[],
        );

    const deleteLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

    const copyLink = (code: string) => {
        setCopied(code);
        setTimeout(() => setCopied(null), 1800);
    };

    const filterEntries: { key: Filter; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'disabled', label: 'Disabled' },
        { key: 'expired', label: 'Expired' },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={<CreateLinkButton />}
            />

            <div className="flex flex-col gap-4 p-4 lg:p-6">
                {/* Search + filter */}
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search links..."
                        className="max-w-xs"
                    />
                    <ToggleGroup
                        multiple={false}
                        value={filter ? [filter] : []}
                        onValueChange={(v) => setFilter((v[0] as Filter) ?? 'all')}
                        variant="outline"
                        size="sm"
                    >
                        {filterEntries.map(({ key, label }) => (
                            <ToggleGroupItem key={key} value={key}>
                                {label}{' '}
                                <span className="ml-1 text-muted-foreground">
                                    {counts[key]}
                                </span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Link</TableHead>
                                <TableHead>Short URL</TableHead>
                                <TableHead className="text-right">Clicks</TableHead>
                                <TableHead className="text-right">Trend</TableHead>
                                <TableHead className="text-right">Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No links found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((link) => (
                                    <LinkRow
                                        key={link.id}
                                        link={link}
                                        copied={copied}
                                        onCopy={copyLink}
                                        onToggle={toggleStatus}
                                        onDelete={deleteLink}
                                        onClick={() => navigate(`/links/${link.id}`)}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LinkRow({
    link,
    copied,
    onCopy,
    onToggle,
    onDelete,
    onClick,
}: {
    link: UrlzLink;
    copied: string | null;
    onCopy: (code: string) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: () => void;
}) {
    return (
        <TableRow className="group">
            <TableCell className="max-w-[220px]">
                <div className="cursor-pointer" onClick={onClick}>
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
                        onClick={() => onCopy(link.code)}
                        className={cn(
                            'rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground',
                            copied === link.code && 'text-green-600 dark:text-green-400 opacity-100',
                        )}
                    >
                        {copied === link.code ? (
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
                        onClick={() => onToggle(link.id)}
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
                        onClick={() => onDelete(link.id)}
                        title="Delete"
                    >
                        <Trash2Icon className="size-3.5" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
