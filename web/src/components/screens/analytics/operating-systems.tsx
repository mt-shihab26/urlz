import type { TBreakdownEntry } from '#/services/analytics';

import { PctListCard } from '#/components/screens/analytics/pct-list-card';

const COLORS: Record<string, string> = {
    Windows: '#0078D4',
    macOS: '#555555',
    Linux: '#F5A623',
    Android: '#3DDC84',
    iOS: '#007AFF',
    Other: '#888888',
};

export const OperatingSystems = ({ items }: { items: TBreakdownEntry[] }) => {
    const data = items.map(({ label, pct }) => ({
        name: label,
        pct,
        color: COLORS[label] ?? COLORS['Other'],
    }));
    return <PctListCard title="Operating Systems" data={data} />;
};
