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
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Loading…
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
