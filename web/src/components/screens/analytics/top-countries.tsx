import type { TClick } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const PALETTE = [
    '#4285F4', '#FF7139', '#22C55E', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#EF4444', '#EC4899', '#14B8A6', '#F97316',
];

export const TopCountries = ({ clicks }: { clicks: TClick[] }) => {
    const data = useMemo(() => {
        const map = new Map<string, { name: string; count: number }>();
        clicks.forEach(({ country_name, country_code }) => {
            if (!country_code) return;
            const prev = map.get(country_code);
            map.set(country_code, { name: country_name, count: (prev?.count ?? 0) + 1 });
        });
        const total = Array.from(map.values()).reduce((a, b) => a + b.count, 0) || 1;
        return Array.from(map.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)
            .map(({ name, count }, i) => ({
                name,
                pct: Math.round((count / total) * 1000) / 10,
                color: PALETTE[i % PALETTE.length],
            }));
    }, [clicks]);

    return <PctListCard title="Top Countries" data={data} />;
};
