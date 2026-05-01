import type { TFilter } from '@/components/screens/links/filters-toggle';
import type { TLink } from '@/types/models';

import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { filterLinks } from '@/lib/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { CreateLinkButton } from '@/components/screens/links/create-link-button';
import { FiltersToggle } from '@/components/screens/links/filters-toggle';
import { LinksPageSkeleton } from '@/components/screens/links/links-page-skeleton';
import { LinksTable } from '@/components/screens/links/links-table';
import { SearchBox } from '@/components/screens/links/search-box';

const Links = () => {
    const [links, setLinks] = useState<TLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<TFilter>('all');

    useEffect(() => {
        subscribeLinks({
            onData: (data) => {
                setLinks(data);
                setLoading(false);
            },
            onError: (error) => {
                setLoading(false);
                toastError(error);
            },
        });
        return () => unsubscribeLinks({ onError: toastError });
    }, []);

    return (
        <DashboardLayout title="Links">
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={<CreateLinkButton />}
            />
            <div className="flex flex-col gap-4 p-4 lg:p-6">
                {loading ? (
                    <LinksPageSkeleton />
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-3">
                            <SearchBox search={search} onSearch={setSearch} />
                            <FiltersToggle links={links} filter={filter} onFilter={setFilter} />
                        </div>
                        <LinksTable links={filterLinks({ links, search, filter })} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Links;
