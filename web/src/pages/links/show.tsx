import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicksByLink, unsubscribeClicksByLink } from '@/collections/clicks';
import { subscribeLink, unsubscribeLink } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { route } from '@/routes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { clicksToBreakdown } from '@/lib/clicks';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Browsers } from '@/components/screens/analytics/browsers';
import { Countries } from '@/components/screens/analytics/countries';
import { Devices } from '@/components/screens/analytics/devices';
import { Languages } from '@/components/screens/analytics/languages';
import { OperatingSystems } from '@/components/screens/analytics/operating-systems';
import { Referrers } from '@/components/screens/analytics/referrers';
import { ClicksChart } from '@/components/screens/links/show/clicks-chart';
import { ClicksTable } from '@/components/screens/links/show/clicks-table';
import { DetailHeader } from '@/components/screens/links/show/detail-header';
import { DetailStats } from '@/components/screens/links/show/detail-stats';
import { Loading } from '@/components/screens/links/show/loading';
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
                <Loading />
            ) : !link ? (
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate(route.linksIndex())}>
                        Back to Links
                    </Button>
                </div>
            ) : (
                <>
                    <DetailHeader
                        link={link}
                        range={range}
                        onRangeChange={setRange}
                        onBack={() => navigate(route.linksIndex())}
                    />
                    <div className="flex flex-col gap-6 p-4 lg:p-6">
                        <DetailStats range={range} link={link} clicks={clicks} />
                        <ClicksChart range={range} clicks={clicks} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Countries items={clicksToBreakdown(clicks, 'country_name')} />
                            <Devices items={clicksToBreakdown(clicks, 'device')} />
                            <Referrers items={clicksToBreakdown(clicks, 'referrer')} />
                            <Browsers items={clicksToBreakdown(clicks, 'browser')} />
                            <OperatingSystems items={clicksToBreakdown(clicks, 'os')} />
                            <Languages items={clicksToBreakdown(clicks, 'language')} />
                        </div>
                        <ClicksTable clicks={clicks} range={range} />
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default LinkDetail;
