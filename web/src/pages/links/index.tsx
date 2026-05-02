import type { TFilter } from '@/components/screens/links/index/filters-toggle';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicks, unsubscribeClicks } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { filterLinks } from '@/lib/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { CreateLinkButton } from '@/components/screens/links/create-link-button';
import { FiltersToggle } from '@/components/screens/links/index/filters-toggle';
import { LinksPageSkeleton } from '@/components/screens/links/index/links-page-skeleton';
import { LinksTable } from '@/components/screens/links/index/links-table';
import { SearchBox } from '@/components/screens/links/index/search-box';

const Links = () => {
    const [filter, setFilter] = useState<TFilter>('all');

    const [loading, setLoading] = useState(true);

    const [links, setLinks] = useState<TLink[]>([]);
    const [clicks, setClicks] = useState<TClick[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        subscribeLinks('All', { onData: setLinks, onError: toastError, onLoading: setLoading });
        subscribeClicks('All', { onData: setClicks, onError: toastError });
        return () => {
            unsubscribeLinks({ onError: toastError });
            unsubscribeClicks({ onError: toastError });
        };
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
                        <LinksTable
                            links={filterLinks({ links, search, filter })}
                            clicks={clicks}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Links;
