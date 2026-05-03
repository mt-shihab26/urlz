import type { TPlan } from '@/types/models';

import { pb } from '@/lib/pb';

export const createCheckoutSession = async (plan: TPlan): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
    });
    return data.url;
};

export const createPortalSession = async (): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/portal', {
        method: 'POST',
    });
    return data.url;
};
