import type { TLink } from '@/types/models';

import { getLinkById } from '@/collections/links';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { LinkClicksChart } from '@/components/screens/link-detail/link-clicks-chart';
import {
    LinkDetailHeader,
    type LinkDetailRange,
} from '@/components/screens/link-detail/link-detail-header';
import { LinkDetailStats } from '@/components/screens/link-detail/link-detail-stats';
import { ReferrersCard } from '@/components/screens/link-detail/referrers-card';
import { TopCountriesCard } from '@/components/screens/link-detail/top-countries-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const countriesData: { country: string; code: string; clicks: number; pct: number }[] = [];
const referrersData: { source: string; clicks: number }[] = [];

function LinkDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [link, setLink] = useState<TLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<LinkDetailRange>('30d');

    useEffect(() => {
        if (!id) return;
        getLinkById(id)
            .then(setLink)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout title="Link">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 border-b px-4 py-4 lg:px-6">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-56" />
                                <Skeleton className="h-4 w-80 max-w-full" />
                            </div>
                            <Skeleton className="h-9 w-48 rounded-md" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 p-4 lg:p-6">
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="rounded-xl border p-6">
                                    <Skeleton className="mb-3 h-4 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border p-6">
                            <Skeleton className="mb-6 h-5 w-36" />
                            <Skeleton className="h-64 w-full" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="rounded-xl border p-6">
                                    <Skeleton className="mb-6 h-5 w-32" />
                                    <div className="flex flex-col gap-3">
                                        {Array.from({ length: 5 }).map((__, rowIndex) => (
                                            <Skeleton key={rowIndex} className="h-8 w-full" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!link) {
        return (
            <DashboardLayout title="Link Not Found">
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate('/links')}>
                        Back to Links
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const days =
        range === '7d' ? 7 : range === '90d' ? 90 : range === 'All' ? link.series.length : 30;
    const slicedSeries = link.series.slice(-days);
    const periodClicks = slicedSeries.reduce((s, d) => s + d.clicks, 0);

    const stats = [
        { label: 'Period Clicks', value: periodClicks.toLocaleString() },
        { label: 'Total Clicks', value: link.clicks.toLocaleString() },
        { label: 'Countries', value: '—' },
        {
            label: 'Created',
            value: new Date(link.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
            }),
        },
    ];

    return (
        <DashboardLayout title={link.title}>
            <LinkDetailHeader
                link={link}
                range={range}
                onRangeChange={setRange}
                onBack={() => navigate('/links')}
            />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <LinkDetailStats stats={stats} />
                <LinkClicksChart data={slicedSeries} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TopCountriesCard countries={countriesData} />
                    <ReferrersCard referrers={referrersData} />
                </div>
            </div>
        </DashboardLayout>
    );
}
export default LinkDetail;
