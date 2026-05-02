import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { RANGES } from '@/lib/ranges';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ClickVolumeChart } from '@/components/screens/overview/click-volume-chart';
import { Loading } from '@/components/screens/overview/loading';
import { StatsCards } from '@/components/screens/overview/overview-stats';
import { TopLinks } from '@/components/screens/overview/top-links';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Overview = () => {
    const [loading, setLoading] = useState(true);

    const [links, setLinks] = useState<TLink[]>([]);
    const [range, setRange] = useState<TRange>('30d');

    useEffect(() => {
        subscribeLinks({ onData: setLinks, onError: toastError, onLoading: setLoading });
        return () => unsubscribeLinks({ onError: toastError });
    }, []);

    return (
        <DashboardLayout title="Overview">
            <Header
                title="Overview"
                description="All your links at a glance"
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
                    <Loading />
                ) : (
                    <>
                        <StatsCards links={links} />
                        <ClickVolumeChart links={links} range={range} />
                        <TopLinks links={links} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Overview;
