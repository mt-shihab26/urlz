import type { TRange } from '#/lib/ranges';

import { getAuth } from '#/collections/users';
import { useUser } from '#/components/providers/auth-provider';
import { canUseFeature, getActivePlan } from '#/lib/plan';
import { getAnalyticsData } from '#/services/analytics';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

import { RangeTabs } from '#/components/composite/range-tabs';
import { RefreshButton } from '#/components/composite/refresh-button';
import { Header } from '#/components/composite/site-header';
import { Browsers } from '#/components/screens/analytics/browsers';
import { ClickVolumeChart } from '#/components/screens/analytics/click-volume-chart';
import { Countries } from '#/components/screens/analytics/countries';
import { Devices } from '#/components/screens/analytics/devices';
import { ExpiringSoon } from '#/components/screens/analytics/expiring-soon';
import { Languages } from '#/components/screens/analytics/languages';
import { Loading } from '#/components/screens/analytics/loading';
import { NoClicks } from '#/components/screens/analytics/no-clicks';
import { OperatingSystems } from '#/components/screens/analytics/operating-systems';
import { Referrers } from '#/components/screens/analytics/referrers';
import { StatsCards } from '#/components/screens/analytics/stats-cards';
import { TopPerforming } from '#/components/screens/analytics/top-performing';

import { RANGES } from '#/lib/ranges';

export const Route = createFileRoute('/dashboard/_auth/analytics')({
    head: () => ({ meta: [{ title: 'Analytics — urlz' }] }),
    validateSearch: (search) => ({
        range: (RANGES.includes(search.range as TRange) ? search.range : '30d') as TRange,
    }),
    loaderDeps: ({ search }) => ({ range: search.range }),
    loader: ({ deps }) =>
        getAnalyticsData(deps.range, canUseFeature(getActivePlan(getAuth()), 'analytics')),
    pendingComponent: () => (
        <>
            <Header title="Analytics" description="Aggregated traffic across all links" />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <Loading />
            </div>
        </>
    ),
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useUser();
    const hasFullAnalytics = canUseFeature(getActivePlan(user), 'analytics');
    const { range } = Route.useSearch();
    const data = Route.useLoaderData();
    const navigate = useNavigate();

    const setRange = (r: TRange) => navigate({ search: { range: r } });

    return (
        <>
            <Header
                title="Analytics"
                description="Aggregated traffic across all links"
                action={
                    <div className="flex items-center gap-2">
                        <RangeTabs range={range} onRange={setRange} />
                        <RefreshButton />
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {!data ? (
                    <Loading />
                ) : (
                    <>
                        <StatsCards stats={data.stats} />
                        {hasFullAnalytics ? (
                            <>
                                <ClickVolumeChart volume={data.volume} />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <Countries items={data.breakdown.countries} />
                                    <Devices items={data.breakdown.devices} />
                                    <Referrers items={data.breakdown.referrers} />
                                    <Browsers items={data.breakdown.browsers} />
                                    <OperatingSystems items={data.breakdown.os} />
                                    <Languages items={data.breakdown.languages} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <ExpiringSoon links={data.expiring_soon} />
                                    <NoClicks links={data.no_clicks} />
                                </div>
                                <TopPerforming topLinks={data.top_links} />
                            </>
                        ) : (
                            <div className="rounded-lg border border-dashed p-8 text-center">
                                <p className="text-sm font-medium">
                                    Full analytics require a Pro plan.
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Charts, breakdowns, and top performing links are available on
                                    Pro and above.
                                </p>
                                <Link
                                    to="/dashboard/billing"
                                    className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Upgrade to Pro
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
