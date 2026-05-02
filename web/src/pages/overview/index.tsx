import type { TClick, TLink } from '@/types/models';

import { subscribeClicks, unsubscribeClicks } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ClickVolumeChart } from '@/components/screens/overview/click-volume-chart';
import { Loading } from '@/components/screens/overview/loading';
import { StatsCards } from '@/components/screens/overview/stats-cards';
import { TopLinks } from '@/components/screens/overview/top-links';

const Overview = () => {
    const [linksLoading, setLinksLoading] = useState(true);
    const [clicksLoading, setClicksLoading] = useState(true);

    const [links, setLinks] = useState<TLink[]>([]);
    const [clicks, setClicks] = useState<TClick[]>([]);

    useEffect(() => {
        subscribeLinks('All', {
            onData: setLinks,
            onError: toastError,
            onLoading: setLinksLoading,
        });
        subscribeClicks('All', {
            onData: setClicks,
            onError: toastError,
            onLoading: setClicksLoading,
        });
        return () => {
            unsubscribeLinks({ onError: toastError });
            unsubscribeClicks({ onError: toastError });
        };
    }, []);

    return (
        <DashboardLayout title="Overview">
            <Header title="Overview" description="All your links at a glance" />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {linksLoading || clicksLoading ? (
                    <Loading />
                ) : (
                    <>
                        <StatsCards clicks={clicks} links={links} />
                        <ClickVolumeChart clicks={clicks} />
                        <TopLinks links={links} clicks={clicks} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Overview;
