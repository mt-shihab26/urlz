import type { TRange } from '#/lib/ranges';

export const queryKeys = {
    invoices: ['invoices'] as const,
    subscription: ['subscription'] as const,
    overview: ['overview'] as const,
    analytics: (range: TRange, full: boolean) => ['analytics', range, full] as const,
    links: {
        index: ['links'] as const,
        show: (id: string, range?: TRange) => ['link', id, range || '30d'] as const,
    },
    clicks: (page: number, range: TRange) => ['clicks', page, range] as const,
};
