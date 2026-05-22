import { getOverviewData } from '#/services/overview';
import { createFileRoute } from '@tanstack/react-router';

import { RefreshButton } from '#/components/composite/refresh-button';
import { Header } from '#/components/composite/site-header';
import { ClickBreakdown } from '#/components/screens/overview/click-breakdown';
import { Loading } from '#/components/screens/overview/loading';
import { StatsCards } from '#/components/screens/overview/stats-cards';
import { TopLinks } from '#/components/screens/overview/top-links';

export const Route = createFileRoute('/dashboard/_auth/overview')({
    head: () => ({ meta: [{ title: 'Overview — urlz' }] }),
    loader: () => getOverviewData(),
    pendingComponent: () => (
        <>
            <Header title="Overview" description="All your links at a glance" />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <Loading />
            </div>
        </>
    ),
    component: Overview,
});

function Overview() {
    const data = Route.useLoaderData();

    return (
        <>
            <Header
                title="Overview"
                description="All your links at a glance"
                action={<RefreshButton />}
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {!data ? (
                    <Loading />
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </>
    );
}
