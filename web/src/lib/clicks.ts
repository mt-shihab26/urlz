import type { TClick } from '@/types/models';

export const clicksToSeries = (clicks: TClick[]) => {
    const byDate = new Map<string, number>();
    clicks.forEach(({ date }) => byDate.set(date, (byDate.get(date) ?? 0) + 1));
    return Array.from(byDate.entries())
        .map(([date, count]) => ({ date, clicks: count }))
        .sort((a, b) => a.date.localeCompare(b.date));
};
