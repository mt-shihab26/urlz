import type { TRange } from '@/lib/ranges';
import type { TShowResponse } from '@/services/link-show';

import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { getLinkShowData } from '@/services/link-show';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { RefreshButton } from '@/components/composite/refresh-button';
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
import { route } from '@/routes';

const LinkDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [range, setRange] = useState<TRange>('30d');

    const { data, isLoading, isFetching, refetch } = useQuery<TShowResponse>({
        queryKey: queryKeys.linkShow(id!, range),
        queryFn: () => getLinkShowData(id!, range),
        enabled: !!id,
        throwOnError: (e) => toastError(e),
    });

    return (
        <DashboardLayout title={isLoading ? 'Link' : (data?.link.title ?? 'Link Not Found')}>
            {isLoading ? (
                <Loading />
            ) : !data ? (
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate(route.linksIndex())}>
                        Back to Links
                    </Button>
                </div>
            ) : (
                <>
                    <DetailHeader
                        link={data.link}
                        range={range}
                        onRangeChange={setRange}
                        onBack={() => navigate(route.linksIndex())}
                    />
                    <div className="flex items-center justify-end px-4 pt-3 lg:px-6">
                        <RefreshButton onClick={refetch} isFetching={isFetching} isLoading={isLoading} />
                    </div>
                    <div className="flex flex-col gap-6 p-4 lg:p-6">
                        <DetailStats stats={data.stats} created={data.link.created} />
                        <ClicksChart volume={data.volume} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Countries items={data.breakdown.countries} />
                            <Devices items={data.breakdown.devices} />
                            <Referrers items={data.breakdown.referrers} />
                            <Browsers items={data.breakdown.browsers} />
                            <OperatingSystems items={data.breakdown.os} />
                            <Languages items={data.breakdown.languages} />
                        </div>
                        <ClicksTable clicks={data.clicks} />
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default LinkDetail;
