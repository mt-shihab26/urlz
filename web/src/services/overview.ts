import type { TBreakdownItem } from '@/components/screens/overview/breakdown-list';

import { pb } from '@/lib/pb';

export type TClickDay = { date: string; clicks: number };

export type TOverviewTopLink = {
    id: string;
    code: string;
    url: string;
    title: string;
    status: 'active' | 'disabled';
    created: string;
    updated: string;
    expires: string;
    totalClicks: number;
    sparkline: TClickDay[];
};

export type TOverviewBreakdown = {
    countries: TBreakdownItem[];
    devices: TBreakdownItem[];
    referrers: TBreakdownItem[];
    browsers: TBreakdownItem[];
    os: TBreakdownItem[];
    languages: TBreakdownItem[];
};

export type TOverviewData = {
    totalClicks: number;
    activeLinks: number;
    totalLinks: number;
    uniqueVisitors: number;
    avgDailyClicks: number;
    clickDelta: number;
    breakdown: TOverviewBreakdown;
    topLinks: TOverviewTopLink[];
};

export const getOverviewData = async (): Promise<TOverviewData> => {
    try {
        return await pb.send<TOverviewData>('/api/overview', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load overview data');
    }
};
