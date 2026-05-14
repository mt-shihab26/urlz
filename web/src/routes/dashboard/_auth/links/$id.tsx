import type { TRange } from '#/lib/ranges';
import type { TResponse } from '#/services/links/show';

import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { getLinkShowData } from '#/services/links/show';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import { RefreshButton } from '#/components/composite/refresh-button';
import { Browsers } from '#/components/screens/analytics/browsers';
import { Countries } from '#/components/screens/analytics/countries';
import { Devices } from '#/components/screens/analytics/devices';
import { Languages } from '#/components/screens/analytics/languages';
import { OperatingSystems } from '#/components/screens/analytics/operating-systems';
import { Referrers } from '#/components/screens/analytics/referrers';
import { ClicksChart } from '#/components/screens/links/show/clicks-chart';
import { ClicksTable } from '#/components/screens/links/show/clicks-table';
import { DetailHeader } from '#/components/screens/links/show/detail-header';
import { DetailStats } from '#/components/screens/links/show/detail-stats';
import { Loading } from '#/components/screens/links/show/loading';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/dashboard/_auth/links/$id')({
    head: () => ({ meta: [{ title: 'Link — urlz' }] }),
    component: LinkDetail,
});

function LinkDetail() {
    const navigate = useNavigate();
    const { id } = useParams({ strict: false });
    const [range, setRange] = useState<TRange>('30d');

    const { data, isLoading, isFetching, refetch } = useQuery<TResponse>({
        queryKey: queryKeys.links.show(id!, range),
        queryFn: () => getLinkShowData(id!, range),
        enabled: !!id,
        throwOnError: (e) => toastError(e),
    });

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : !data ? (
                <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <p className="text-muted-foreground">Link not found.</p>
                    <Button variant="outline" onClick={() => navigate({ to: '/dashboard/links' })}>
                        Back to Links
                    </Button>
                </div>
            ) : (
                <>
                    <DetailHeader
                        link={data.link}
                        range={range}
                        onRangeChange={setRange}
                        onBack={() => navigate({ to: '/dashboard/links' })}
                    />
                    <div className="flex items-center justify-end px-4 pt-3 lg:px-6">
                        <RefreshButton
                            onClick={refetch}
                            isFetching={isFetching}
                            isLoading={isLoading}
                        />
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
        </>
    );
}
