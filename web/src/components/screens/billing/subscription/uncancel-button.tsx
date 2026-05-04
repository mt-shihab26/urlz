import { uncancelSubscription } from '@/collections/billing';
import { queryKeys } from '@/lib/query-keys';
import { toastError } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const UncancelButton = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const handleUncancel = async () => {
        setLoading(true);
        try {
            await uncancelSubscription();
            await queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to reactivate subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleUncancel} disabled={!!loading}>
            {loading ? 'Reactivating…' : "Don't Cancel"}
        </Button>
    );
};
