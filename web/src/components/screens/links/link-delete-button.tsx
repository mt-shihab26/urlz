import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '#/components/ui/alert-dialog';

import type { TLink } from '#/types/models';

import { deleteLink } from '#/collections/links';
import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '#/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export const LinkDeleteButton = ({ link }: { link: TLink }) => {
    const queryClient = useQueryClient();
    const handleDelete = async () => {
        try {
            await deleteLink(link.id);
            queryClient.invalidateQueries({ queryKey: queryKeys.links.index });
            queryClient.invalidateQueries({ queryKey: queryKeys.links.show(link.id) });
        } catch (e) {
            toastError(e instanceof Error ? e.message : 'Failed to delete link');
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                    >
                        <Trash2Icon className="size-3.5" />
                    </Button>
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete link</AlertDialogTitle>
                    <AlertDialogDescription>
                        "{link.title}" will be permanently deleted. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
