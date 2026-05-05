import { createCancelUrl, successfullCheckout } from '@/collections/billing';
import { refresh } from '@/collections/users';
import { toastError, toastSuccess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export const useHandleCancel = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (searchParams.get('success') !== '1' || !sessionId) return;
        setSearchParams({}, { replace: true });
        successfullCheckout(sessionId)
            .then(() => refresh())
            .then(() => toastSuccess('Subscription activated!'))
            .catch(() => toastError('Failed to activate plan. Contact support.'));
    }, []);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const url = await createCancelUrl();
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to open cancellation');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleCancel,
    };
};
