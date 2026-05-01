import type { TLink } from '@/types/models';

import { getLinks } from '@/collections/links';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { CreateLinkButton } from '@/components/screens/links/create-link-button';
import { FiltersToggle, type TFilter } from '@/components/screens/links/filters-toggle';
import { LinksTable } from '@/components/screens/links/links-table';
import { Input } from '@/components/ui/input';

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

    return (
        <DashboardLayout title="Links">
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={<CreateLinkButton />}
            />
            <div className="flex flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search links..."
                        className="max-w-xs"
                    />
                    <FiltersToggle links={links} filter={filter} onFilter={setFilter} />
                </div>
                <LinksTable links={filtered} />
            </div>
        </DashboardLayout>
    );
};

export default Links;
