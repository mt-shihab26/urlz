import { createManageUrl } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const ManageButton = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleManage = async () => {
        setLoading(true);
        try {
            const url = await createManageUrl();
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to open billing portal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleManage} disabled={!!loading}>
            {loading ? 'Opening…' : 'Manage'}
        </Button>
    );
};
