import type { TResponse } from '#/services/links';
import type { TFilter } from '#/types/utils';

import { filterLinks } from '#/lib/links';
import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { getLinksData } from '#/services/links';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { RefreshButton } from '#/components/composite/refresh-button';
import { Header } from '#/components/composite/site-header';
import { DashboardLayout } from '#/components/layouts/dashboard-layout';
import { CreateLinkButton } from '#/components/screens/links/create-link-button';
import { FiltersTabs } from '#/components/screens/links/index/filters-tabs';
import { LinksTable } from '#/components/screens/links/index/links-table';
import { Loading } from '#/components/screens/links/index/loading';
import { SearchBox } from '#/components/screens/links/index/search-box';

const Links = () => {
    const [filter, setFilter] = useState<TFilter>('all');
    const [search, setSearch] = useState('');

    const { data, isLoading, isFetching, refetch } = useQuery<TResponse>({
        queryKey: queryKeys.links.index,
        queryFn: getLinksData,
        throwOnError: (e) => toastError(e),
    });

    const links = data?.links ?? [];

    return (
        <DashboardLayout title="Links">
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={
                    <div className="flex items-center gap-2">
                        <RefreshButton
                            onClick={refetch}
                            isFetching={isFetching}
                            isLoading={isLoading}
                        />
                        <CreateLinkButton />
                    </div>
                }
            />
            <div className="flex flex-col gap-4 p-4 lg:p-6">
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-3">
                            <SearchBox search={search} onSearch={setSearch} />
                            <FiltersTabs links={links} filter={filter} onFilter={setFilter} />
                        </div>
                        <LinksTable links={filterLinks({ links, search, filter })} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Links;
