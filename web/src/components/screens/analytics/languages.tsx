import type { TClick } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

export const Languages = ({ clicks }: { clicks: TClick[] }) => {
    const data = useMemo(() => {
        const totals = new Map<string, number>();
        clicks.forEach(({ language }) => {
            if (!language) return;
            totals.set(language, (totals.get(language) ?? 0) + 1);
        });
        const total = Array.from(totals.values()).reduce((a, b) => a + b, 0);
        if (total === 0) return [];
        const palette = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
        return Array.from(totals.entries())
            .map(([name, count], i) => ({
                name,
                pct: Math.round((count / total) * 1000) / 10,
                color: palette[i % palette.length],
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [clicks]);

    return <PctListCard title="Languages" data={data} />;
};
