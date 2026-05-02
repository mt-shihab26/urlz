import type { TLinkDetailRange } from '@/components/screens/links/show/link-detail-header';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicksByLink, unsubscribeClicksByLink } from '@/collections/clicks';
import { subscribeLink, unsubscribeLink } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { route } from '@/routes';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { LinkClicksChart } from '@/components/screens/links/show/link-clicks-chart';
import { LinkDetailHeader } from '@/components/screens/links/show/link-detail-header';
import { LinkDetailPageSkeleton } from '@/components/screens/links/show/link-detail-page-skeleton';
import { LinkDetailStats } from '@/components/screens/links/show/link-detail-stats';
import { ReferrersCard } from '@/components/screens/links/show/referrers-card';
import { TopCountriesCard } from '@/components/screens/links/show/top-countries-card';
import { Button } from '@/components/ui/button';

const LinkDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);

    const [link, setLink] = useState<TLink | null>(null);
    const [clicks, setClicks] = useState<TClick[]>([]);
    const [range, setRange] = useState<TLinkDetailRange>('30d');

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        subscribeLink(id, { onData: setLink, onError: toastError, onLoading: setLoading });
        subscribeClicksByLink(id, { onData: setClicks, onError: toastError });
        return () => {
            unsubscribeLink(id, { onError: toastError });
            unsubscribeClicksByLink({ onError: toastError });
        };
    }, [id]);

    const linkWithClicks = useMemo(
        () => (link ? { ...link, clicks } : null),
        [link, clicks],
    );

    return (
        <DashboardLayout title={loading ? 'Link' : (link?.title ?? 'Link Not Found')}>
            {loading ? (
                <LinkDetailPageSkeleton />
            ) : !linkWithClicks ? (
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate(route.linksIndex())}>
                        Back to Links
                    </Button>
                </div>
            ) : (
                <>
                    <LinkDetailHeader
                        link={linkWithClicks}
                        range={range}
                        onRangeChange={setRange}
                        onBack={() => navigate(route.linksIndex())}
                    />
                    <div className="flex flex-col gap-6 p-4 lg:p-6">
                        <LinkDetailStats range={range} link={linkWithClicks} />
                        <LinkClicksChart range={range} link={linkWithClicks} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TopCountriesCard clicks={linkWithClicks.clicks} />
                            <ReferrersCard clicks={linkWithClicks.clicks} />
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default LinkDetail;
