import type { TClick } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const COLORS: Record<string, string> = {
    desktop: '#6366F1',
    mobile: '#22C55E',
    tablet: '#F59E0B',
    Other: '#888888',
};

export const Devices = ({ clicks }: { clicks: TClick[] }) => {
    const data = useMemo(() => {
        const totals = new Map<string, number>();
        clicks.forEach(({ device }) => {
            if (!device) return;
            totals.set(device, (totals.get(device) ?? 0) + 1);
        });
        const total = Array.from(totals.values()).reduce((a, b) => a + b, 0);
        if (total === 0) return [];
        return Array.from(totals.entries())
            .map(([name, count]) => ({
                name,
                pct: Math.round((count / total) * 1000) / 10,
                color: COLORS[name] ?? COLORS['Other'],
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [clicks]);

    return <PctListCard title="Devices" data={data} />;
};
