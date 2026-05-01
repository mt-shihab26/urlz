import type { TLink, TLinkStatus } from '@/types/models';

import { getLinks } from '@/collections/links';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { CreateLinkButton } from '@/components/screens/links/create-link-button';
import { LinksTable } from '@/components/screens/links/links-table';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type TFilter = 'all' | TLinkStatus;

const filterEntries: { key: TFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'expired', label: 'Expired' },
];

const Links = () => {
    const [links, setLinks] = useState<TLink[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<TFilter>('all');

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
                        onValueChange={(v) => setFilter((v[0] as TFilter) ?? 'all')}
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
                <LinksTable links={filtered} />
            </div>
        </DashboardLayout>
    );
};

export default Links;
