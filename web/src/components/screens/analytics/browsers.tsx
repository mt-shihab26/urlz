import type { TBreakdownEntry } from '#/services/analytics';

import { PctListCard } from '#/components/screens/analytics/pct-list-card';

const COLORS: Record<string, string> = {
    Chrome: '#4285F4',
    Firefox: '#FF7139',
    Safari: '#006CFF',
    Edge: '#0078D4',
    Opera: '#FF1B2D',
    IE: '#1EBBEE',
    Other: '#888888',
};

export const Browsers = ({ items }: { items: TBreakdownEntry[] }) => {
    const data = items.map(({ label, pct }) => ({
        name: label,
        pct,
        color: COLORS[label] ?? COLORS['Other'],
    }));
    return <PctListCard title="Browsers" data={data} />;
};
