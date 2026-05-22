import { createUncancelUrl } from '#/collections/billing';
import { refresh } from '#/collections/users';
import { toastError, toastSuccess } from '#/lib/toast';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

export const useHandleUncancel = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleUncancel = async () => {
        setLoading(true);
        try {
            await createUncancelUrl();
            await refresh();
            await router.invalidate();
            toastSuccess('Subscription reactivated.');
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
