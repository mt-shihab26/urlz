import type { TLink } from '#/types/models';
import type { TFilter } from '#/types/utils';

import { pb } from '#/lib/pb';

export type TClickDay = {
    date: string;
    clicks: number;
};

export type TLinkItem = TLink & {
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TLinkCounts = {
    all: number;
    active: number;
    disabled: number;
    expired: number;
};

export type TResponse = {
    links: TLinkItem[];
    counts: TLinkCounts;
    total_items: number;
    total_pages: number;
};

export const getLinksData = async (
    filter?: TFilter,
    search?: string,
    page = 1,
): Promise<TResponse> => {
    try {
        const query: Record<string, string> = { page: String(page) };
        if (filter) query.filter = filter;
        if (search) query.search = search;
        return await pb.send<TResponse>('/api/links', { method: 'GET', query });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load links data');
    }
};
