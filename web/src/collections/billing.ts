import type { TPlan } from '@/types/models';

import { pb } from '@/lib/pb';

export type TSubscription = {
    id: string;
    status: string;
    start_date: number;
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
    cancel_at?: number;
    trial_end?: number;
};

export const getSubscription = async (): Promise<TSubscription> => {
    try {
        return pb.send<TSubscription>('/api/billing/subscription', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed fetching subscription');
    }
};

export type TInvoice = {
    id: string;
    number: string;
    amount_paid: number;
    currency: string;
    status: string;
    created: number;
    period_start: number;
    period_end: number;
    hosted_invoice_url: string;
    invoice_pdf: string;
};

export const getInvoices = async (): Promise<TInvoice[]> => {
    try {
        return await pb.send<TInvoice[]>('/api/billing/invoices', { method: 'GET' });
    } catch (e: any) {
        throw new Error(e?.message || 'Failed fetching invoices');
    }
};

export const createCancelUrl = async (): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/cancel', { method: 'POST' });
    return data.url;
};

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
