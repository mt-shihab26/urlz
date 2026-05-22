import type { TFilter } from '#/types/utils';
import type { ReactNode } from 'react';

import { filterLinks } from '#/lib/links';
import { getLinksData } from '#/services/links';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { RefreshButton } from '#/components/composite/refresh-button';
import { RouteError } from '#/components/composite/route-error';
import { Header } from '#/components/composite/site-header';
import { CreateLinkButton } from '#/components/screens/links/create-link-button';
import { FiltersTabs } from '#/components/screens/links/index/filters-tabs';
import { LinksTable } from '#/components/screens/links/index/links-table';
import { Loading } from '#/components/screens/links/index/loading';
import { SearchBox } from '#/components/screens/links/index/search-box';

export const Route = createFileRoute('/dashboard/_auth/links/')({
    head: () => ({ meta: [{ title: 'Links — urlz' }] }),
    loader: () => getLinksData(),
    pendingComponent: () => (
        <Layout refreshDisable>
            <Loading />
        </Layout>
    ),
    errorComponent: ({ error }) => (
        <Layout>
            <RouteError error={error} />
        </Layout>
    ),
    component: RouteComponent,
});

function Layout({
    children,
    refreshDisable = false,
}: {
    children: ReactNode;
    refreshDisable?: boolean;
}) {
    return (
        <>
            <Header
                title="Links"
                description="Manage and monitor all your shortened links"
                action={
                    !refreshDisable && (
                        <div className="flex items-center gap-2">
                            <RefreshButton />
                            <CreateLinkButton />
                        </div>
                    )
                }
            />
            <div className="flex flex-col gap-4 p-4 lg:p-6">{children}</div>
        </>
    );
}

function RouteComponent() {
    const data = Route.useLoaderData();

    const [filter, setFilter] = useState<TFilter>('all');
    const [search, setSearch] = useState('');

    const links = data.links ?? [];

    return (
        <Layout>
            <div className="flex flex-wrap items-center gap-3">
                <SearchBox search={search} onSearch={setSearch} />
                <FiltersTabs links={links} filter={filter} onFilter={setFilter} />
            </div>
            <LinksTable links={filterLinks({ links, search, filter })} />
        </Layout>
    );
}
