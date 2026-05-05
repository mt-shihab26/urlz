import { createUncancelUrl } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

export const useHandleUncancel = () => {
    const [loading, setLoading] = useState<boolean>(false);

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
