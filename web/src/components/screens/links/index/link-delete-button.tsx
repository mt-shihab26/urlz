import type { TLink } from '@/types/models';

import { deleteLink } from '@/collections/links';
import { toastError } from '@/lib/toast';

import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export const LinkDeleteButton = ({ link }: { link: TLink }) => {
    const handleDelete = async () => {
        try {
            await deleteLink(link.id);
        } catch (e) {
            toastError(e instanceof Error ? e.message : 'Failed to delete link');
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
            onClick={handleDelete}
        >
            <Trash2Icon className="size-3.5" />
        </Button>
    );
};
