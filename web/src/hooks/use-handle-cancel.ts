import { createCancelUrl } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

export const useHandleCancel = () => {
    const [loading, setLoading] = useState<boolean>(false);

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
