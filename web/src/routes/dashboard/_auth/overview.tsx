import type { ReactNode } from 'react';

import { getOverviewData } from '#/services/overview';
import { createFileRoute } from '@tanstack/react-router';

import { RefreshButton } from '#/components/composite/refresh-button';
import { RouteError } from '#/components/composite/route-error';
import { Header } from '#/components/composite/site-header';
import { ClickBreakdown } from '#/components/screens/overview/click-breakdown';
import { Loading } from '#/components/screens/overview/loading';
import { StatsCards } from '#/components/screens/overview/stats-cards';
import { TopLinks } from '#/components/screens/overview/top-links';

export const Route = createFileRoute('/dashboard/_auth/overview')({
    head: () => ({ meta: [{ title: 'Overview — urlz' }] }),
    loader: () => getOverviewData(),
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
    children?: ReactNode;
    refreshDisable?: boolean;
}) {
    return (
        <>
            <Header
                title="Overview"
                description="All your links at a glance"
                action={!refreshDisable && <RefreshButton />}
            />
            {children}
        </>
    );
}

function RouteComponent() {
    const data = Route.useLoaderData();

    return (
        <Layout>
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <StatsCards
                    totalClicks={data.total_clicks}
                    activeLinks={data.active_links}
                    totalLinks={data.total_links}
                    uniqueVisitors={data.unique_visitors}
                    avgDailyClicks={data.avg_daily_clicks}
                    clickDelta={data.click_delta}
                />
                <ClickBreakdown breakdown={data.breakdown} />
                <TopLinks topLinks={data.top_links} />
            </div>
        </Layout>
    );
}
