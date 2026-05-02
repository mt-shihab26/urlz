import type { TClick } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const PALETTE = [
    '#4285F4',
    '#FF7139',
    '#22C55E',
    '#F59E0B',
    '#8B5CF6',
    '#06B6D4',
    '#EF4444',
    '#EC4899',
    '#14B8A6',
    '#F97316',
];

export const Referrers = ({ clicks }: { clicks: TClick[] }) => {
    const data = useMemo(() => {
        const map = new Map<string, number>();
        clicks.forEach(({ referrer }) => {
            if (!referrer) return;
            map.set(referrer, (map.get(referrer) ?? 0) + 1);
        });
        const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
        if (total === 0) return [];
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count], i) => ({
                name,
                pct: Math.round((count / total) * 1000) / 10,
                color: PALETTE[i % PALETTE.length],
            }));
    }, [clicks]);

    return <PctListCard title="Referrers" data={data} />;
};
