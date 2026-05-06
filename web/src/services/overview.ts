import type { TBreakdownItem } from '@/types/utils';

import { pb } from '@/lib/pb';

export type TClickDay = { date: string; clicks: number };

export type TTopLink = {
    id: string;
    code: string;
    url: string;
    title: string;
    status: 'active' | 'disabled';
    created: string;
    updated: string;
    expires: string;
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TBreakdownData = {
    countries: TBreakdownItem[];
    devices: TBreakdownItem[];
    referrers: TBreakdownItem[];
    browsers: TBreakdownItem[];
    os: TBreakdownItem[];
    languages: TBreakdownItem[];
};

export type TResponse = {
    total_clicks: number;
    active_links: number;
    total_links: number;
    unique_visitors: number;
    avg_daily_clicks: number;
    click_delta: number;
    breakdown: TBreakdownData;
    top_links: TTopLink[];
};

export const getOverviewData = async (): Promise<TResponse> => {
    try {
        return await pb.send<TResponse>('/api/overview', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load overview data');
    }
};
