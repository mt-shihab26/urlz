import type { TSubscription } from '@/collections/billing';

import { useHandleCancel } from '@/hooks/use-handle-cancel';
import { getScheduledToCancel } from '@/lib/billing';

import { Button } from '@/components/ui/button';

export const CancelButton = ({ subscription }: { subscription: TSubscription }) => {
    const { loading, handleCancel } = useHandleCancel();

    const canceling = getScheduledToCancel(subscription);

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
