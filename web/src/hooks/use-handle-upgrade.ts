import type { TPlan } from '#/types/models';

import { createCheckoutUrl, successfullCheckout } from '#/collections/billing';
import { refresh } from '#/collections/users';
import { queryKeys } from '#/lib/query-keys';
import { toastError, toastSuccess } from '#/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useHandleUpgrade = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState<TPlan | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get('session_id');
        if (searchParams.get('success') !== '1' || !sessionId) return;
        window.history.replaceState({}, '', window.location.pathname);
        successfullCheckout(sessionId)
            .then(() => refresh())
            .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.subscription }))
            .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.invoices }))
            .then(() => toastSuccess('Subscription activated!'))
            .catch(() => toastError('Failed to activate plan. Contact support.'));
    }, []);

    const handleUpgrade = async (plan: TPlan) => {
        setLoading(plan);
        try {
            const url = await createCheckoutUrl(plan);
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to start checkout');
        } finally {
            setLoading(null);
        }
    };

    return { loading, handleUpgrade };
};
