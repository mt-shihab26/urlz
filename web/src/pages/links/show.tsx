import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicksByLink, unsubscribeClicksByLink } from '@/collections/clicks';
import { subscribeLink, unsubscribeLink } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { route } from '@/routes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Referrers } from '@/components/screens/analytics/referrers';
import { TopCountries } from '@/components/screens/analytics/top-countries';
import { LinkClicksChart } from '@/components/screens/links/show/link-clicks-chart';
import { LinkClicksTable } from '@/components/screens/links/show/link-clicks-table';
import { LinkDetailHeader } from '@/components/screens/links/show/link-detail-header';
import { LinkDetailPageSkeleton } from '@/components/screens/links/show/link-detail-page-skeleton';
import { LinkDetailStats } from '@/components/screens/links/show/link-detail-stats';
import { Button } from '@/components/ui/button';

const LinkDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [range, setRange] = useState<TRange>('30d');

    const [loading, setLoading] = useState(true);

    const [link, setLink] = useState<TLink | null>(null);
    const [clicks, setClicks] = useState<TClick[]>([]);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        subscribeLink(id, { onData: setLink, onError: toastError, onLoading: setLoading });
        subscribeClicksByLink(id, range, { onData: setClicks, onError: toastError });
        return () => {
            unsubscribeLink(id, { onError: toastError });
            unsubscribeClicksByLink({ onError: toastError });
        };
    }, [id, range]);

    return (
        <DashboardLayout title={loading ? 'Link' : (link?.title ?? 'Link Not Found')}>
            {loading ? (
                <LinkDetailPageSkeleton />
            ) : !link ? (
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate(route.linksIndex())}>
                        Back to Links
                    </Button>
                </div>
            ) : (
                <>
                    <LinkDetailHeader
                        link={link}
                        range={range}
                        onRangeChange={setRange}
                        onBack={() => navigate(route.linksIndex())}
                    />
                    <div className="flex flex-col gap-6 p-4 lg:p-6">
                        <LinkDetailStats range={range} link={link} clicks={clicks} />
                        <LinkClicksChart range={range} clicks={clicks} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TopCountries clicks={clicks} />
                            <Referrers clicks={clicks} />
                        </div>
                        <LinkClicksTable clicks={clicks} range={range} />
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default LinkDetail;
