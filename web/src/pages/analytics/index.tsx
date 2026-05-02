import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicks, unsubscribeClicks } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { RangeTabs } from '@/components/composite/range-tabs';
import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Browsers } from '@/components/screens/analytics/browsers';
import { ClickVolumeChart } from '@/components/screens/analytics/click-volume-chart';
import { Devices } from '@/components/screens/analytics/devices';
import { ExpiringSoon } from '@/components/screens/analytics/expiring-soon';
import { Languages } from '@/components/screens/analytics/languages';
import { Loading } from '@/components/screens/analytics/loading';
import { NoClicks } from '@/components/screens/analytics/no-clicks';
import { OperatingSystems } from '@/components/screens/analytics/operating-systems';
import { Referrers } from '@/components/screens/analytics/referrers';
import { StatsCards } from '@/components/screens/analytics/stats-cards';
import { TopCountries } from '@/components/screens/analytics/top-countries';
import { TopPerforming } from '@/components/screens/analytics/top-performing';

const Analytics = () => {
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
                        <ClickVolumeChart clicks={clicks} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <TopCountries clicks={clicks} />
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
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
