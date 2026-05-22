import { useRouter, useRouterState } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

export const RefreshButton = () => {
    const router = useRouter();
    const isRefreshing = useRouterState({ select: (s) => s.isLoading });

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => router.invalidate()}
            disabled={isRefreshing}
        >
            <RefreshCwIcon className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
        </Button>
    );
};
