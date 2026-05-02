import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const COLORS: Record<string, string> = {
    Chrome: '#4285F4',
    Firefox: '#FF7139',
    Safari: '#006CFF',
    Edge: '#0078D4',
    Opera: '#FF1B2D',
    IE: '#1EBBEE',
    Other: '#888888',
};

export const AnalyticsBrowsers = ({ links }: { links: TLink[]; range: TRange }) => {
    const data = useMemo(() => {
        const totals = new Map<string, number>();
        links.forEach((link) =>
            link.browsers?.forEach(({ name, clicks }) =>
                totals.set(name, (totals.get(name) ?? 0) + clicks),
            ),
        );
        const total = Array.from(totals.values()).reduce((a, b) => a + b, 0);
        if (total === 0) return [];
        return Array.from(totals.entries())
            .map(([name, clicks]) => ({
                name,
                pct: Math.round((clicks / total) * 1000) / 10,
                color: COLORS[name] ?? COLORS['Other'],
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [links]);

    return <PctListCard title="Browsers" data={data} />;
};
