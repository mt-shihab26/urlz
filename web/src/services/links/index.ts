import type { TLink } from '#/types/models';
import type { TFilter } from '#/types/utils';

import { pb } from '#/lib/pb';

export type TClickDay = { date: string; clicks: number };

export type TLinkItem = TLink & {
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TResponse = { links: TLinkItem[] };

export const getLinksData = async (
    filter: TFilter | undefined = 'all',
    search: string | undefined = '',
): Promise<TResponse> => {
    try {
        const query: Record<string, string> = {};
        if (filter && filter !== 'all') query.filter = filter;
        if (search) query.search = search;
        return await pb.send<TResponse>('/api/links', { method: 'GET', query });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load links data');
    }
};
