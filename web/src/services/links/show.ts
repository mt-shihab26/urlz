import type { TBreakdownData, TVolumeDay } from '@/services/analytics';
import type { TLink } from '@/types/models';

import { pb } from '@/lib/pb';

export type TStats = {
    total_clicks: number;
    period_clicks: number;
    unique_countries: number;
};

export type TClickRecord = {
    id: string;
    date: string;
    country_name: string;
    referrer: string;
    browser: string;
    os: string;
    device: string;
};

export type TResponse = {
    link: TLink;
    stats: TStats;
    volume: TVolumeDay[];
    breakdown: TBreakdownData;
    clicks: TClickRecord[];
};

export const getLinkShowData = async (id: string, range: string): Promise<TResponse> => {
    try {
        const params = new URLSearchParams({ range });
        return await pb.send<TResponse>(`/api/links/${id}?${params}`, { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load link data');
    }
};
