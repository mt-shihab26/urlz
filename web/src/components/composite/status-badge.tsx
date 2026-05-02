import type { TLinkStatus } from '@/types/models';

import { cn } from '@/lib/utils';

export const StatusBadge = ({ status }: { status: TLinkStatus }) => {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                status === 'active' && 'bg-green-500/10 text-green-600 dark:text-green-400',
                status === 'disabled' && 'bg-muted text-muted-foreground',
            )}
        >
            <span className="size-1.5 shrink-0 rounded-full bg-current" />
            {status === 'active' ? 'Active' : 'Disabled'}
        </span>
    );
};
