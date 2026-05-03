import type { TPlan } from '@/types/models';

import { pb } from '@/lib/pb';

export const createCheckoutSession = async (plan: TPlan, coupon?: string): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan, coupon: coupon || undefined }),
    });
    return data.url;
};

export const syncCheckoutSession = async (sessionId: string): Promise<void> => {
    await pb.send('/api/billing/sync', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId }),
    });
};

export const syncPortalReturn = async (): Promise<void> => {
    await pb.send('/api/billing/sync-portal', { method: 'POST' });
};

export const createPortalSession = async (): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/portal', {
        method: 'POST',
    });
    return data.url;
};
