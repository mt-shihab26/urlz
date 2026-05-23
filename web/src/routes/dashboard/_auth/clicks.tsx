import type { TClickItem } from '#/services/clicks';
import type { ReactNode } from 'react';

import { rangeSchema } from '#/lib/ranges';
import { head } from '#/lib/utils';
import { getClicksData } from '#/services/clicks';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

import { RangeTabs } from '#/components/composite/range-tabs';
import { RefreshButton } from '#/components/composite/refresh-button';
import { RouteError } from '#/components/composite/route-error';
import { Header } from '#/components/composite/site-header';
import { ClicksTable } from '#/components/screens/clicks/clicks-table';
import { DetailDrawer } from '#/components/screens/clicks/detail-drawer';
import { Loading } from '#/components/screens/clicks/loading';

import { DEFAULT_RANGE } from '#/lib/ranges';

const searchSchema = z.object({
    range: rangeSchema,
    page: z.coerce.number().int().min(1).optional(),
});

export const Route = createFileRoute('/dashboard/_auth/clicks')({
    head: () => head('Clicks'),
    validateSearch: (search) => searchSchema.parse(search),
    loaderDeps: ({ search }) => ({
        range: search.range ?? DEFAULT_RANGE,
        page: search.page ?? 1,
    }),
    loader: ({ deps }) => getClicksData(deps.page, deps.range),
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
    component: Clicks,
});

function Layout({
    children,
    refreshDisable = false,
}: {
    children: ReactNode;
    refreshDisable?: boolean;
}) {
    const { range = DEFAULT_RANGE } = Route.useSearch();

    const navigate = Route.useNavigate();

    return (
        <>
            <Header
                title="Clicks"
                description="Full paginated click history"
                action={
                    !refreshDisable && (
                        <div className="flex items-center gap-2">
                            <RangeTabs
                                range={range}
                                onRange={(r) =>
                                    navigate({
                                        search: (prev) => ({ ...prev, range: r, page: undefined }),
                                    })
                                }
                            />
                            <RefreshButton />
                        </div>
                    )
                }
            />
            {children}
        </>
    );
}

function Clicks() {
    const { page = 1 } = Route.useSearch();

    const data = Route.useLoaderData();
    const navigate = Route.useNavigate();

    const [selectedClick, setSelectedClick] = useState<TClickItem | null>(null);

    const setPage = (p: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: p > 1 ? p : undefined }),
            resetScroll: false,
        });
    };

    return (
        <Layout>
            <div className="p-4 lg:p-6">
                <ClicksTable
                    result={data ?? null}
                    loading={false}
                    page={page}
                    onPage={setPage}
                    onClickRow={setSelectedClick}
                />
            </div>
            <DetailDrawer
                click={selectedClick}
                open={selectedClick !== null}
                onClose={() => setSelectedClick(null)}
            />
        </Layout>
    );
}
