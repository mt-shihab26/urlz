import type { TLink } from '@/types/models';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { EditLinkDialog } from './edit-link-dialog';

export const LinkEditButton = ({ link }: { link: TLink }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                title="Edit"
                onClick={() => setOpen(true)}
            >
                <PencilIcon className="size-3.5" />
            </Button>
            <EditLinkDialog key={link.updated} link={link} open={open} onOpenChange={setOpen} />
        </>
    );
};
