import type { ComponentProps, ReactNode } from 'react';

import { cn } from '#/lib/utils';
import { useState } from 'react';

import { Button } from '#/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CreateLinkDialog } from './create-link-dialog';

export const CreateLinkButton = ({
    className,
    children,
    variant,
    size,
}: {
    className?: string;
    children?: ReactNode;
    variant?: ComponentProps<typeof Button>['variant'];
    size?: ComponentProps<typeof Button>['size'];
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={cn('gap-1.5', className)}
                onClick={() => setOpen(true)}
            >
                <PlusIcon className="size-4" />
                {children ?? 'New Link'}
            </Button>
            <CreateLinkDialog open={open} onOpenChange={setOpen} />
        </>
    );
};
