import type { TResponse } from '#/services/overview';

import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { getOverviewData } from '#/services/overview';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { RefreshButton } from '#/components/composite/refresh-button';
import { Header } from '#/components/composite/site-header';
import { DashboardLayout } from '#/components/layouts/dashboard-layout';
import { ClickBreakdown } from '#/components/screens/overview/click-breakdown';
import { Loading } from '#/components/screens/overview/loading';
import { StatsCards } from '#/components/screens/overview/stats-cards';
import { TopLinks } from '#/components/screens/overview/top-links';

export const Route = createFileRoute('/dashboard/_auth/overview')({
    component: Overview,
});

function Overview() {
    const { data, isLoading, isFetching, refetch } = useQuery<TResponse>({
        queryKey: queryKeys.overview,
        queryFn: getOverviewData,
        throwOnError: (e) => toastError(e),
    });

    return (
        <DashboardLayout title="Overview">
            <Header
                title="Overview"
                description="All your links at a glance"
                action={
                    <RefreshButton
                        onClick={refetch}
                        isFetching={isFetching}
                        isLoading={isLoading}
                    />
                }
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {isLoading || !data ? (
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
        </DashboardLayout>
    );
}
