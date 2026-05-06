import type { TBreakdownData } from '@/services/overview';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreakdownList } from './breakdown-list';

export const ClickBreakdown = ({ breakdown }: { breakdown: TBreakdownData }) => {
    const cards = [
        { title: 'Top Countries', items: breakdown.countries },
        { title: 'Top Devices', items: breakdown.devices },
        { title: 'Top Referrers', items: breakdown.referrers },
        { title: 'Top Browsers', items: breakdown.browsers },
        { title: 'Top Operating Systems', items: breakdown.os },
        { title: 'Top Languages', items: breakdown.languages },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ title, items }) => (
                <Card key={title}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BreakdownList items={items} empty="No data" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
