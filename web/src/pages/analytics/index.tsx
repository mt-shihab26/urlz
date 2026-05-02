import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { RANGES } from '@/lib/ranges';
import { toastError } from '@/lib/toast';
import { useEffect, useMemo, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AnalyticsChart } from '@/components/screens/analytics/analytics-chart';
import { AnalyticsSkeleton } from '@/components/screens/analytics/analytics-skeleton';
import { AnalyticsStats } from '@/components/screens/analytics/analytics-stats';
import { ClicksByLink } from '@/components/screens/analytics/clicks-by-link';
import { ExpiringSoon } from '@/components/screens/analytics/expiring-soon';
import { PctListCard } from '@/components/screens/analytics/pct-list-card';
import { TopPerforming } from '@/components/screens/analytics/top-performing';
import { ReferrersCard } from '@/components/screens/links/show/referrers-card';
import { TopCountriesCard } from '@/components/screens/links/show/top-countries-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const browsersData: { name: string; pct: number; color: string }[] = [];
const osData: { name: string; pct: number; color: string }[] = [];

const Analytics = () => {
    const [links, setLinks] = useState<TLink[]>([]);
    const [range, setRange] = useState<TRange>('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        subscribeLinks({ onData: setLinks, onError: toastError, onLoading: setLoading });
        return () => unsubscribeLinks({ onError: toastError });
    }, []);

    const totalSeries = useMemo(() => {
        const byDate = new Map<string, number>();
        links.forEach((link) =>
            link.series.forEach(({ date, clicks }) =>
                byDate.set(date, (byDate.get(date) ?? 0) + clicks),
            ),
        );
        return Array.from(byDate.entries())
            .map(([date, clicks]) => ({ date, clicks }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [links]);

    const countries = useMemo(() => {
        const map = new Map<string, { country: string; code: string; clicks: number }>();
        links.forEach((link) =>
            link.countries.forEach(({ country, code, clicks }) => {
                const prev = map.get(code);
                map.set(code, { country, code, clicks: (prev?.clicks ?? 0) + clicks });
            }),
        );
        const total = Array.from(map.values()).reduce((s, c) => s + c.clicks, 0) || 1;
        return Array.from(map.values())
            .sort((a, b) => b.clicks - a.clicks)
            .map((c) => ({ ...c, pct: Math.round((c.clicks / total) * 100) }));
    }, [links]);

    const referrers = useMemo(() => {
        const map = new Map<string, number>();
        links.forEach((link) =>
            link.referrers.forEach(({ source, clicks }) =>
                map.set(source, (map.get(source) ?? 0) + clicks),
            ),
        );
        return Array.from(map.entries())
            .map(([source, clicks]) => ({ source, clicks }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [links]);

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
                {loading ? (
                    <AnalyticsSkeleton />
                ) : (
                    <>
                        <AnalyticsStats links={links} />
                        <AnalyticsChart series={totalSeries} range={range} />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TopCountriesCard countries={countries} />
                            <ReferrersCard referrers={referrers} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <PctListCard title="Browsers" data={browsersData} />
                            <PctListCard title="Operating Systems" data={osData} />
                        </div>
                        <ExpiringSoon links={links} />
                        <TopPerforming links={links} range={range} />
                        <ClicksByLink links={links} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
