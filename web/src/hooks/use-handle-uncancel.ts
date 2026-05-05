import { createUncancelUrl } from '@/collections/billing';
import { refresh } from '@/collections/users';
import { queryKeys } from '@/lib/query-keys';
import { toastError, toastSuccess } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useHandleUncancel = () => {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState<boolean>(false);

    const handleUncancel = async () => {
        setLoading(true);
        try {
            await createUncancelUrl();
            await refresh();
            await queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
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
