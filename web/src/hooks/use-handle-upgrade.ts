import type { TPlan } from '@/types/models';

import { createCheckoutUrl, successfullCheckout } from '@/collections/billing';
import { refresh } from '@/collections/users';
import { toastError, toastSuccess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export const useHandleUpgrade = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (searchParams.get('success') !== '1' || !sessionId) return;
        setSearchParams({}, { replace: true });
        successfullCheckout(sessionId)
            .then(() => refresh())
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
