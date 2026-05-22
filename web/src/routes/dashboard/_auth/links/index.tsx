import type { TFilter } from '#/types/utils';
import type { ReactNode } from 'react';

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
const DEFAULT_FILTER: TFilter = 'all';
const DEFAULT_SEARCH = '';

export const Route = createFileRoute('/dashboard/_auth/links/')({
    head: () => ({ meta: [{ title: 'Links — urlz' }] }),
    validateSearch: (search): { filter?: TFilter; search?: string; page?: number } => ({
        filter:
            FILTERS.includes(search.filter as TFilter) && search.filter !== DEFAULT_FILTER
                ? (search.filter as TFilter)
                : undefined,
        search: (search.search as string) || undefined,
        page: Number(search.page) > 1 ? Number(search.page) : undefined,
    }),
    loaderDeps: ({ search }) => ({ filter: search.filter, search: search.search, page: search.page }),
    loader: ({ deps }) => getLinksData(deps.filter, deps.search, deps.page),
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
    const { filter = DEFAULT_FILTER, search = DEFAULT_SEARCH, page = 1 } = Route.useSearch();
    const navigate = Route.useNavigate();

    const setSearch = (s: string) =>
        navigate({ search: (prev) => ({ ...prev, search: s || undefined, page: undefined }) });

    const setFilter = (f: TFilter) =>
        navigate({ search: (prev) => ({ ...prev, filter: f === DEFAULT_FILTER ? undefined : f, page: undefined }) });

    const setPage = (p: number) =>
        navigate({ search: (prev) => ({ ...prev, page: p > 1 ? p : undefined }) });

    const links = data.links ?? [];

    return (
        <Layout>
            <div className="flex flex-wrap items-center gap-3">
                <SearchBox search={search} onSearch={setSearch} />
                <FiltersTabs counts={data.counts} filter={filter} onFilter={setFilter} />
            </div>
            <LinksTable links={links} page={page} totalItems={data.total_items} totalPages={data.total_pages} onPage={setPage} />
        </Layout>
    );
}
