import type { TRange } from '@/lib/ranges';

export const queryKeys = {
    invoices: ['invoices'] as const,
    subscription: ['subscription'] as const,
    overview: ['overview'] as const,
    analytics: (range: TRange) => ['analytics', range] as const,
};
