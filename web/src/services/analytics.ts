import type { TRange } from '@/lib/ranges';

import { pb } from '@/lib/pb';

export type TStats = {
    total_clicks: number;
    total_links: number;
    active_links: number;
    disabled_links: number;
    expired_links: number;
    unique_visitors: number;
    avg_daily_clicks: number;
    peak_day: number;
    click_delta: number;
    avg_clicks_per_link: number;
};

export type TVolumeDay = { date: string; clicks: number };

export type TBreakdownEntry = { label: string; pct: number };

export type TBreakdownData = {
    countries: TBreakdownEntry[];
    devices: TBreakdownEntry[];
    referrers: TBreakdownEntry[];
    browsers: TBreakdownEntry[];
    os: TBreakdownEntry[];
    languages: TBreakdownEntry[];
};

export type TExpiringLink = { id: string; title: string; code: string; expires: string };

export type TNoClickLink = { id: string; title: string; code: string; created: string };

export type TClickDay = { date: string; clicks: number };

export type TTopLink = {
    id: string;
    code: string;
    url: string;
    title: string;
    status: 'active' | 'disabled';
    total_clicks: number;
    sparkline: TClickDay[];
};

export type TAnalyticsResponse = {
    stats: TStats;
    volume: TVolumeDay[];
    breakdown: TBreakdownData;
    expiring_soon: TExpiringLink[];
    no_clicks: TNoClickLink[];
    top_links: TTopLink[];
};

export const getAnalyticsData = async (
    range: TRange,
    full: boolean,
): Promise<TAnalyticsResponse> => {
    try {
        const params = new URLSearchParams({ range });
        if (full) params.set('full', '1');
        return await pb.send<TAnalyticsResponse>(`/api/analytics?${params}`, {
            method: 'GET',
        });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load analytics data');
    }
};
