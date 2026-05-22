import type { TFilter } from '#/types/utils';
import type { ReactNode } from 'react';

import { filterLinks } from '#/lib/links';
import { getLinksData } from '#/services/links';
import { createFileRoute } from '@tanstack/react-router';

import { RefreshButton } from '#/components/composite/refresh-button';
import { RouteError } from '#/components/composite/route-error';
import { Header } from '#/components/composite/site-header';
import { CreateLinkButton } from '#/components/screens/links/create-link-button';
import { FiltersTabs } from '#/components/screens/links/index/filters-tabs';
import { LinksTable } from '#/components/screens/links/index/links-table';
import { Loading } from '#/components/screens/links/index/loading';
import { SearchBox } from '#/components/screens/links/index/search-box';

const FILTERS: TFilter[] = ['all', 'active', 'disabled', 'expired'];

export const Route = createFileRoute('/dashboard/_auth/links/')({
    head: () => ({ meta: [{ title: 'Links — urlz' }] }),
    validateSearch: (search) => ({
        filter: (FILTERS.includes(search.filter as TFilter) ? search.filter : 'all') as TFilter,
        search: String(search.search ?? ''),
    }),
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
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const links = data.links ?? [];

    return (
        <Layout>
            <div className="flex flex-wrap items-center gap-3">
                <SearchBox
                    search={search.search}
                    onSearch={(search) => navigate({ search: (prev) => ({ ...prev, search }) })}
                />
                <FiltersTabs
                    links={links}
                    filter={search.filter}
                    onFilter={(filter) => navigate({ search: (prev) => ({ ...prev, filter }) })}
                />
            </div>
            <LinksTable
                links={filterLinks({ links, search: search.search, filter: search.filter })}
            />
        </Layout>
    );
}
