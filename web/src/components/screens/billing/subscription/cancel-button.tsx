import type { TSubscription } from '@/collections/billing';

import { createCancelUrl } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const CancelButton = ({ sub }: { sub?: TSubscription | null }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const canceling = !!sub?.cancel_at_period_end;

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

    return (
        <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!!loading || canceling}
            title={canceling ? 'Subscription already scheduled for cancellation' : undefined}
        >
            {loading ? 'Opening…' : 'Cancel'}
        </Button>
    );
};
