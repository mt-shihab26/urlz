import type { TClick } from '@/types/models';

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

export const AnalyticsBrowsers = ({ clicks }: { clicks: TClick[] }) => {
    const data = useMemo(() => {
        const totals = new Map<string, number>();
        clicks.forEach(({ browser }) => totals.set(browser, (totals.get(browser) ?? 0) + 1));
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

    return <PctListCard title="Browsers" data={data} />;
};
