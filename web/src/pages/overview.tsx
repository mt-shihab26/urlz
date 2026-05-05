import type { TOverviewData } from '@/services/overview';

import { toastError } from '@/lib/toast';
import { getOverviewData } from '@/services/overview';
import { useCallback, useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ClickBreakdown } from '@/components/screens/overview/click-breakdown';
import { Loading } from '@/components/screens/overview/loading';
import { StatsCards } from '@/components/screens/overview/stats-cards';
import { TopLinks } from '@/components/screens/overview/top-links';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

const Overview = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TOverviewData | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            setData(await getOverviewData());
        } catch (e: any) {
            toastError(e.message);
        } finally {
            if (isRefresh) setRefreshing(false);
            else setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <DashboardLayout title="Overview">
            <Header
                title="Overview"
                description="All your links at a glance"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => load(true)}
                        disabled={refreshing || loading}
                    >
                        <RefreshCwIcon className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </Button>
                }
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {loading || !data ? (
                    <Loading />
                ) : (
                    <>
                        <StatsCards
                            totalClicks={data.totalClicks}
                            activeLinks={data.activeLinks}
                            totalLinks={data.totalLinks}
                            uniqueVisitors={data.uniqueVisitors}
                            avgDailyClicks={data.avgDailyClicks}
                            clickDelta={data.clickDelta}
                        />
                        <ClickBreakdown breakdown={data.breakdown} />
                        <TopLinks topLinks={data.topLinks} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Overview;
