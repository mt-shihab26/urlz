import type { TBreakdownEntry } from '#/services/analytics';
import type { TClick } from '#/types/models';

export const clicksToBreakdown = (clicks: TClick[], key: keyof TClick): TBreakdownEntry[] => {
    const counts = new Map<string, number>();
    clicks.forEach((c) => {
        const val = (c[key] as string) || 'Unknown';
        counts.set(val, (counts.get(val) ?? 0) + 1);
    });
    const total = clicks.length || 1;
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }));
};

export const clicksToSeries = (clicks: TClick[]) => {
    const byDate = new Map<string, number>();
    clicks.forEach(({ date }) => byDate.set(date, (byDate.get(date) ?? 0) + 1));
    return Array.from(byDate.entries())
        .map(([date, count]) => ({ date, clicks: count }))
        .sort((a, b) => a.date.localeCompare(b.date));
};
