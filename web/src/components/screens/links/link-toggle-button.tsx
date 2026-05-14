import type { TLink } from '#/types/models';

import { toggleLinkStatus } from '#/collections/links';
import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '#/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const LinkToggleButton = ({ link }: { link: TLink }) => {
    const queryClient = useQueryClient();
    const handleToggle = async () => {
        try {
            await toggleLinkStatus(link.id, link.status);
            queryClient.invalidateQueries({ queryKey: queryKeys.links.index });
            queryClient.invalidateQueries({ queryKey: queryKeys.links.show(link.id) });
        } catch (e) {
            toastError(e instanceof Error ? e.message : 'Failed to toggle link status');
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title={link.status === 'active' ? 'Disable' : 'Enable'}
            onClick={handleToggle}
        >
            {link.status === 'active' ? (
                <EyeOffIcon className="size-3.5" />
            ) : (
                <EyeIcon className="size-3.5" />
            )}
        </Button>
    );
};
