import type { TBreakdownEntry } from '#/services/analytics';

import { PctListCard } from '#/components/screens/analytics/pct-list-card';

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

export const Devices = ({ items }: { items: TBreakdownEntry[] }) => {
    const data = items.map(({ label, pct }, i) => ({
        name: label,
        pct,
        color: PALETTE[i % PALETTE.length],
    }));
    return <PctListCard title="Devices" data={data} />;
};
