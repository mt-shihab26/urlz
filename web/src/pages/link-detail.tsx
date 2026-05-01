import type { TLinkDetailRange } from '@/components/screens/link-detail/link-detail-header';
import type { TLink } from '@/types/models';

import { getLinkById } from '@/collections/links';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { LinkClicksChart } from '@/components/screens/link-detail/link-clicks-chart';
import { LinkDetailHeader } from '@/components/screens/link-detail/link-detail-header';
import { LinkDetailPageSkeleton } from '@/components/screens/link-detail/link-detail-page-skeleton';
import { LinkDetailStats } from '@/components/screens/link-detail/link-detail-stats';
import { ReferrersCard } from '@/components/screens/link-detail/referrers-card';
import { TopCountriesCard } from '@/components/screens/link-detail/top-countries-card';
import { Button } from '@/components/ui/button';

const countriesData: { country: string; code: string; clicks: number; pct: number }[] = [];
const referrersData: { source: string; clicks: number }[] = [];

const LinkDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [link, setLink] = useState<TLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<TLinkDetailRange>('30d');

    useEffect(() => {
        if (!id) return;
        getLinkById(id)
            .then(setLink)
            .finally(() => setLoading(false));
    }, [id]);

    return loading ? (
        <DashboardLayout title="Link">
            <LinkDetailPageSkeleton />
        </DashboardLayout>
    ) : !link ? (
        <DashboardLayout title="Link Not Found">
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                <p className="text-muted-foreground">Link not found.</p>
                <Button variant="outline" onClick={() => navigate('/links')}>
                    Back to Links
                </Button>
            </div>
        </DashboardLayout>
    ) : (
        <DashboardLayout title={link.title}>
            <LinkDetailHeader
                link={link}
                range={range}
                onRangeChange={setRange}
                onBack={() => navigate('/links')}
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <LinkDetailStats range={range} link={link} />
                <LinkClicksChart range={range} link={link} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TopCountriesCard countries={countriesData} />
                    <ReferrersCard referrers={referrersData} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LinkDetail;
