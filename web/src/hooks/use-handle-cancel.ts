import { createCancelUrl, syncCancelReturn } from '@/collections/billing';
import { refresh } from '@/collections/users';
import { queryKeys } from '@/lib/query-keys';
import { toastError, toastSuccess } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export const useHandleCancel = () => {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('cancel') === '1') {
            setSearchParams({}, { replace: true });
            syncCancelReturn()
                .then(() => refresh())
                .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.subscription }))
                .then(() => toastSuccess('Subscription cancelled.'))
                .catch(() => toastError('Failed to sync cancellation. Contact support.'));
        }
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
