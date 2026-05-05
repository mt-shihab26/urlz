import { createUncancelUrl, syncCancelReturn } from '@/collections/billing';
import { refresh } from '@/collections/users';
import { toastError, toastSuccess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export const useHandleUncancel = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('uncancel') === '1') {
            setSearchParams({}, { replace: true });
            syncCancelReturn()
                .then(() => refresh())
                .then(() => toastSuccess('Subscription cancelled.'))
                .catch(() => toastError('Failed to sync cancellation. Contact support.'));
        }
    }, []);

    const handleUncancel = async () => {
        setLoading(true);
        try {
            await createUncancelUrl();
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to reactivate subscription');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleUncancel,
    };
};
