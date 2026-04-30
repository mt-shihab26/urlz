import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { deleteLink, getLinks, toggleLinkStatus } from '@/collections/links';
import { CreateLinkButton } from '@/components/composite/create-link-dialog';
import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { LinkRow } from '@/components/screens/links/link-row';
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
import type { TLink, TLinkStatus } from '@/types/models';

type Filter = 'all' | TLinkStatus;

const filterEntries: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'expired', label: 'Expired' },
];

const Links = () => {
    const navigate = useNavigate();
    const [links, setLinks] = useState<TLink[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        getLinks().then(setLinks);
    }, []);

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

    const handleToggle = async (id: string) => {
        const link = links.find((l) => l.id === id)!;
        const updated = await toggleLinkStatus(id, link.status);
        setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    };

    const handleDelete = async (id: string) => {
        await deleteLink(id);
        setLinks((prev) => prev.filter((l) => l.id !== id));
    };

    const copyLink = (code: string) => {
        setCopied(code);
        setTimeout(() => setCopied(null), 1800);
    };

    return (
        <DashboardLayout title="Links">
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={
                    <CreateLinkButton onCreated={(link) => setLinks((prev) => [link, ...prev])} />
                }
            />

            <div className="flex flex-col gap-4 p-4 lg:p-6">
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
                                <span className="ml-1 text-muted-foreground">{counts[key]}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

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
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
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
};

export default Links;
