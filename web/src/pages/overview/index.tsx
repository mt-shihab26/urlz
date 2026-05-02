import type { TLink } from '@/types/models';

import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { useEffect, useState } from 'react';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { OverviewChart, type TRange } from '@/components/screens/overview/overview-chart';
import { OverviewStats } from '@/components/screens/overview/overview-stats';
import { TopLinks } from '@/components/screens/overview/top-links';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const RANGES = ['7d', '30d', '90d', 'All'] as const;

const Overview = () => {
    const [links, setLinks] = useState<TLink[]>([]);
    const [range, setRange] = useState<TRange>('30d');

    useEffect(() => {
        subscribeLinks({ onData: setLinks });
        return () => unsubscribeLinks({});
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
                <OverviewStats links={links} />
                <OverviewChart links={links} range={range} />
                <TopLinks links={links} />
            </div>
        </DashboardLayout>
    );
};

export default Overview;
