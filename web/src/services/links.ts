import type { TLink } from '@/types/models';

import { pb } from '@/lib/pb';

export type TClickDay = { date: string; clicks: number };

export type TLinkItem = TLink & {
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TLinksResponse = { links: TLinkItem[] };

export const getLinksData = async (): Promise<TLinksResponse> => {
    try {
        return await pb.send<TLinksResponse>('/api/links', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load links data');
    }
};
