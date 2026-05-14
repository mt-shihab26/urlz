import type { TLink } from '#/types/models';

import { pb } from '#/lib/pb';

export type TClickDay = { date: string; clicks: number };

export type TLinkItem = TLink & {
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TResponse = { links: TLinkItem[] };

export const getLinksData = async (): Promise<TResponse> => {
    try {
        return await pb.send<TResponse>('/api/links', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load links data');
    }
};
