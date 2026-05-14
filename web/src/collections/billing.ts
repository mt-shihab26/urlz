import type { TPlan, TSubscriptionStatus } from '#/types/models';

import { pb } from '#/lib/pb';

export const createCheckoutUrl = async (plan: TPlan): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
    });
    return data.url;
};

export const successfullCheckout = async (session_id: string): Promise<void> => {
    await pb.send('/api/billing/success', {
        method: 'POST',
        body: JSON.stringify({ session_id }),
    });
};

export const createCancelUrl = async (): Promise<string> => {
    const data = await pb.send<{ url: string }>('/api/billing/cancel', { method: 'POST' });
    return data.url;
};

export const syncCancelReturn = async (): Promise<void> => {
    await pb.send('/api/billing/sync-cancel', { method: 'POST' });
};

export const createUncancelUrl = async (): Promise<void> => {
    await pb.send('/api/billing/uncancel', { method: 'POST' });
};

export const syncUncancelReturn = async (): Promise<void> => {
    await pb.send('/api/billing/sync-uncancel', { method: 'POST' });
};

export type TSubscription = {
    id: string;
    status: TSubscriptionStatus;
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
