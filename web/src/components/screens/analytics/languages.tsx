import type { TBreakdownEntry } from '@/services/analytics';

import { PctListCard } from '@/components/screens/analytics/pct-list-card';

const PALETTE = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const Languages = ({ items }: { items: TBreakdownEntry[] }) => {
    const data = items.map(({ label, pct }, i) => ({
        name: label,
        pct,
        color: PALETTE[i % PALETTE.length],
    }));
    return <PctListCard title="Languages" data={data} />;
};
