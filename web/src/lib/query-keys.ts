import type { TRange } from '@/lib/ranges';

export const queryKeys = {
    invoices: ['invoices'] as const,
    subscription: ['subscription'] as const,
    links: ['links'] as const,
    overview: ['overview'] as const,
    analytics: (range: TRange, full: boolean) => ['analytics', range, full] as const,
    clicks: (page: number, range: TRange) => ['clicks', page, range] as const,
    linkShow: (id: string, range?: TRange) => ['link', id, range || '30d'] as const,
};
