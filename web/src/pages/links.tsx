import type { TFilter } from '@/components/screens/links/filters-toggle';
import type { TLink } from '@/types/models';

import { getLinks } from '@/collections/links';
import { filterLinks } from '@/lib/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { CreateLinkButton } from '@/components/screens/links/create-link-button';
import { FiltersToggle } from '@/components/screens/links/filters-toggle';
import { LinksTable } from '@/components/screens/links/links-table';
import { SearchBox } from '@/components/screens/links/search-box';

const Links = () => {
    const [links, setLinks] = useState<TLink[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<TFilter>('all');

    useEffect(() => {
        (async () => {
            try {
                throw new Error('Error bro');
                setLinks(await getLinks());
            } catch (e) {
                toastError(e instanceof Error ? e.message : 'Failed to fetch links');
            }
        })();
    }, []);

    return (
        <DashboardLayout title="Links">
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={<CreateLinkButton />}
            />
            <div className="flex flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <SearchBox search={search} onSearch={setSearch} />
                    <FiltersToggle links={links} filter={filter} onFilter={setFilter} />
                </div>
                <LinksTable links={filterLinks({ links, search, filter })} />
            </div>
        </DashboardLayout>
    );
};

export default Links;
