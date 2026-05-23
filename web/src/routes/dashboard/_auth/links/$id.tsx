import { DEFAULT_RANGE, RANGES } from '#/lib/ranges';
import { toastError } from '#/lib/toast';
import { head } from '#/lib/utils';
import { getLinkShowData } from '#/services/links/show';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

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

const searchSchema = z.object({
    range: z.enum(RANGES).optional(),
});

export const Route = createFileRoute('/dashboard/_auth/links/$id')({
    head: () => head('Link'),
    validateSearch: (search) => searchSchema.parse(search),
    loaderDeps: ({ search }) => ({ range: search.range ?? DEFAULT_RANGE }),
    loader: async ({ params, deps }) => {
        try {
            return await getLinkShowData(params.id, deps.range);
        } catch (e) {
            toastError(e);
            return null;
        }
    },
    pendingComponent: Loading,
    component: LinkDetail,
});

function LinkDetail() {
    const navigate = useNavigate();
    const { id } = Route.useParams();
    const { range = DEFAULT_RANGE } = Route.useSearch();
    const data = Route.useLoaderData();

    const setRange = (r: typeof RANGES[number]) =>
        navigate({ to: '/dashboard/links/$id', params: { id }, search: { range: r } });

    return (
        <>
            {!data ? (
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
                        <RefreshButton />
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
