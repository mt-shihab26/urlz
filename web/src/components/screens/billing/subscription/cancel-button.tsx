import { useHandleCancel } from '#/hooks/use-handle-cancel';

import { Button } from '#/components/ui/button';

export const CancelButton = () => {
    const { loading, handleCancel } = useHandleCancel();

    return (
        <Button variant="destructive" onClick={handleCancel} disabled={!!loading}>
            {loading ? 'Opening…' : 'Cancel'}
        </Button>
    );
};
