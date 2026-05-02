import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const COLORS: Record<string, string> = {
    Windows: '#0078D4',
    macOS: '#555555',
    Linux: '#F5A623',
    Android: '#3DDC84',
    iOS: '#007AFF',
    Other: '#888888',
};

export const AnalyticsOses = ({ links }: { links: TLink[]; range: TRange }) => {
    const data = useMemo(() => {
        const totals = new Map<string, number>();
        links.forEach((link) =>
            link.clicks.forEach(({ os }) =>
                totals.set(os, (totals.get(os) ?? 0) + 1),
            ),
        );
        const total = Array.from(totals.values()).reduce((a, b) => a + b, 0);
        if (total === 0) return [];
        return Array.from(totals.entries())
            .map(([name, count]) => ({
                name,
                pct: Math.round((count / total) * 1000) / 10,
                color: COLORS[name] ?? COLORS['Other'],
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [links]);

    return <PctListCard title="Operating Systems" data={data} />;
};
