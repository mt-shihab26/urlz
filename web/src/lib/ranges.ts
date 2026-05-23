import { z } from 'zod';

export const RANGES = ['7d', '30d', '90d', 'All'] as const;
export const DEFAULT_RANGE: TRange = '30d';

export type TRange = (typeof RANGES)[number];

const RANGE_DAYS: Record<TRange, number | null> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    All: null,
};

export const rangeSchema = z.object({
    range: z.enum(RANGES).default(DEFAULT_RANGE),
});

export const getRangeStartDate = (range: TRange) => {
    const days = RANGE_DAYS[range];
    if (days === null) return null;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
};
