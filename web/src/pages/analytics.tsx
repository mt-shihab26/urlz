import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicks, unsubscribeClicks } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { useUser } from '@/components/providers/auth-provider';
import { canUseFeature, getActivePlan } from '@/lib/plan';
import { toastError } from '@/lib/toast';
import { route } from '@/routes';
import { useEffect, useState } from 'react';

import { RangeTabs } from '@/components/composite/range-tabs';
import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Browsers } from '@/components/screens/analytics/browsers';
import { ClickVolumeChart } from '@/components/screens/analytics/click-volume-chart';
import { Countries } from '@/components/screens/analytics/countries';
import { Devices } from '@/components/screens/analytics/devices';
import { ExpiringSoon } from '@/components/screens/analytics/expiring-soon';
import { Languages } from '@/components/screens/analytics/languages';
import { Loading } from '@/components/screens/analytics/loading';
import { NoClicks } from '@/components/screens/analytics/no-clicks';
import { OperatingSystems } from '@/components/screens/analytics/operating-systems';
import { Referrers } from '@/components/screens/analytics/referrers';
import { StatsCards } from '@/components/screens/analytics/stats-cards';
import { TopPerforming } from '@/components/screens/analytics/top-performing';
import { Link } from 'react-router';

const Analytics = () => {
    const { user } = useUser();
    const hasFullAnalytics = canUseFeature(getActivePlan(user), 'analytics');

    const [linksLoading, setLinksLoading] = useState(true);
    const [clicksLoading, setClicksLoading] = useState(true);

    const [range, setRange] = useState<TRange>('30d');

    const [links, setLinks] = useState<TLink[]>([]);
    const [clicks, setClicks] = useState<TClick[]>([]);

    useEffect(() => {
        subscribeLinks(range, {
            onData: setLinks,
            onError: toastError,
            onLoading: setLinksLoading,
        });

        subscribeClicks(range, {
            onData: setClicks,
            onError: toastError,
            onLoading: setClicksLoading,
        });

        return () => {
            unsubscribeLinks({ onError: toastError });
            unsubscribeClicks({ onError: toastError });
        };
    }, [range]);

    return (
        <DashboardLayout title="Analytics">
            <Header
                title="Analytics"
                description="Aggregated traffic across all links"
                action={<RangeTabs range={range} onRange={setRange} />}
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {linksLoading || clicksLoading ? (
                    <Loading />
                ) : (
                    <>
                        <StatsCards links={links} clicks={clicks} />
                        {hasFullAnalytics ? (
                            <>
                                <ClickVolumeChart clicks={clicks} />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <Countries clicks={clicks} />
                                    <Devices clicks={clicks} />
                                    <Referrers clicks={clicks} />
                                    <Browsers clicks={clicks} />
                                    <OperatingSystems clicks={clicks} />
                                    <Languages clicks={clicks} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <ExpiringSoon links={links} />
                                    <NoClicks links={links} clicks={clicks} />
                                </div>
                                <TopPerforming links={links} clicks={clicks} />
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
                                    to={route.billingIndex()}
                                    className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Upgrade to Pro
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
