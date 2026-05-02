import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicks, unsubscribeClicks } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { useEffect, useMemo, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AnalyticsBrowsers } from '@/components/screens/analytics/analytics-browsers';
import { AnalyticsChart } from '@/components/screens/analytics/analytics-chart';
import { AnalyticsCountries } from '@/components/screens/analytics/analytics-countries';
import { AnalyticsOses } from '@/components/screens/analytics/analytics-oses';
import { AnalyticsReferrers } from '@/components/screens/analytics/analytics-referrers';
import { AnalyticsSkeleton } from '@/components/screens/analytics/analytics-skeleton';
import { AnalyticsStats } from '@/components/screens/analytics/analytics-stats';
import { ExpiringSoon } from '@/components/screens/analytics/expiring-soon';
import { TopPerforming } from '@/components/screens/analytics/top-performing';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { RANGES } from '@/lib/ranges';

const Analytics = () => {
    const [linksLoading, setLinksLoading] = useState(true);

    const [links, setLinks] = useState<TLink[]>([]);
    const [clicks, setClicks] = useState<TClick[]>([]);
    const [range, setRange] = useState<TRange>('30d');

    useEffect(() => {
        subscribeLinks({ onData: setLinks, onError: toastError, onLoading: setLinksLoading });
        subscribeClicks({ onData: setClicks, onError: toastError });
        return () => {
            unsubscribeLinks({ onError: toastError });
            unsubscribeClicks({ onError: toastError });
        };
    }, []);

    const linksWithClicks = useMemo(
        () => links.map((link) => ({ ...link, clicks: clicks.filter((c) => c.link === link.id) })),
        [links, clicks],
    );

    return (
        <DashboardLayout title="Analytics">
            <Header
                title="Analytics"
                description="Aggregated traffic across all links"
                action={
                    <ToggleGroup
                        multiple={false}
                        value={range ? [range] : []}
                        onValueChange={(v) => setRange((v[0] as TRange) ?? '30d')}
                        variant="outline"
                        size="sm"
                    >
                        {RANGES.map((r) => (
                            <ToggleGroupItem key={r} value={r}>
                                {r}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                }
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {linksLoading ? (
                    <AnalyticsSkeleton />
                ) : (
                    <>
                        <AnalyticsStats links={linksWithClicks} />
                        <AnalyticsChart links={linksWithClicks} range={range} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AnalyticsCountries links={linksWithClicks} />
                            <AnalyticsReferrers links={linksWithClicks} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AnalyticsBrowsers links={linksWithClicks} range={range} />
                            <AnalyticsOses links={linksWithClicks} range={range} />
                        </div>
                        <ExpiringSoon links={linksWithClicks} />
                        <TopPerforming links={linksWithClicks} range={range} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
