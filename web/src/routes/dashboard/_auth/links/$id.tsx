import type { TRange } from '#/lib/ranges';
import type { ReactNode } from 'react';

import { searchRangeSchema } from '#/lib/ranges';
import { head } from '#/lib/utils';
import { getLinkShowData } from '#/services/links/show';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';

import { RouteError } from '#/components/composite/route-error';
import { Browsers } from '#/components/screens/analytics/browsers';
import { Countries } from '#/components/screens/analytics/countries';
import { Devices } from '#/components/screens/analytics/devices';
import { Languages } from '#/components/screens/analytics/languages';
import { OperatingSystems } from '#/components/screens/analytics/operating-systems';
import { Referrers } from '#/components/screens/analytics/referrers';
import { ClicksChart } from '#/components/screens/links/show/clicks-chart';
import { ClicksTable } from '#/components/screens/links/show/clicks-table';
import { DetailHeader } from '#/components/screens/links/show/detail-header';
import { DetailStats } from '#/components/screens/links/show/detail-stats';
import { Loading } from '#/components/screens/links/show/loading';
import { NotFound } from '#/components/screens/links/show/not-found';

import { DEFAULT_RANGE } from '#/lib/ranges';

export const Route = createFileRoute('/dashboard/_auth/links/$id')({
    head: () => head('Link'),
    validateSearch: (search) => searchRangeSchema.parse(search),
    loaderDeps: ({ search }) => ({ range: search.range ?? DEFAULT_RANGE }),
    loader: async ({ params, deps }) => {
        const data = await getLinkShowData(params.id, deps.range);
        if (!data) throw notFound();
        return data;
    },
    pendingComponent: () => (
        <Layout>
            <Loading />
        </Layout>
    ),
    errorComponent: ({ error }) => (
        <Layout>
            <RouteError error={error} />
        </Layout>
    ),
    notFoundComponent: () => (
        <Layout>
            <NotFound />
        </Layout>
    ),
    component: LinkDetail,
});

function Layout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col">{children}</div>;
}

function LinkDetail() {
    const { id } = Route.useParams();
    const { range = DEFAULT_RANGE } = Route.useSearch();

    const navigate = useNavigate();
    const data = Route.useLoaderData();

    const setRange = (r: TRange) =>
        navigate({ to: '/dashboard/links/$id', params: { id }, search: { range: r } });

    return (
        <Layout>
            <DetailHeader
                link={data.link}
                range={range}
                onRangeChange={setRange}
                onBack={() => navigate({ to: '/dashboard/links' })}
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <DetailStats stats={data.stats} created={data.link.created} />
                <ClicksChart volume={data.volume} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Countries items={data.breakdown.countries} />
                    <Devices items={data.breakdown.devices} />
                    <Referrers items={data.breakdown.referrers} />
                    <Browsers items={data.breakdown.browsers} />
                    <OperatingSystems items={data.breakdown.os} />
                    <Languages items={data.breakdown.languages} />
                </div>
                <ClicksTable clicks={data.clicks} />
            </div>
        </Layout>
    );
}
