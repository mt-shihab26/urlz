import type { TRange } from '@/lib/ranges';

import { pb } from '@/lib/pb';

export type TClickItem = {
    id: string;
    date: string;
    link: string;
    link_title: string;
    link_code: string;
    link_url: string;
    country_name: string;
    country_code: string;
    city: string;
    region: string;
    timezone: string;
    referrer: string;
    browser: string;
    os: string;
    device: string;
    language: string;
    ip: string;
    user_agent: string;
};

export type TResponse = {
    items: TClickItem[];
    total_items: number;
    total_pages: number;
};

export const getClicksData = async (page: number, range: TRange): Promise<TResponse> => {
    try {
        const params = new URLSearchParams({ page: String(page), range });
        return await pb.send<TResponse>(`/api/clicks?${params}`, { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed to load clicks data');
    }
};
