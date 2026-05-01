import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const Form = ({
    onSubmit,
    children,
    className,
}: {
    onSubmit: () => void;
    children: ReactNode;
    className?: string;
}) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className={cn('flex flex-col gap-4', className)}
        >
            {children}
        </form>
    );
};
