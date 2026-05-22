import { createCancelUrl, syncCancelReturn } from '#/collections/billing';
import { refresh } from '#/collections/users';
import { toastError, toastSuccess } from '#/lib/toast';
import { useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const useHandleCancel = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('cancel') === '1') {
            window.history.replaceState({}, '', window.location.pathname);
            syncCancelReturn()
                .then(() => refresh())
                .then(() => router.invalidate())
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

    return { loading, handleCancel };
};
