import { useHandleUncancel } from '#/hooks/use-handle-uncancel';

import { Button } from '#/components/ui/button';

export const UncancelButton = () => {
    const { loading, handleUncancel } = useHandleUncancel();

    return (
        <Button variant="outline" onClick={handleUncancel} disabled={!!loading}>
            {loading ? 'Reactivating…' : "Don't Cancel"}
        </Button>
    );
};
