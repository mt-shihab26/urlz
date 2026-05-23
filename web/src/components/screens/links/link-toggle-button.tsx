import type { TLink } from '#/types/models';

import { toggleLinkStatus } from '#/collections/links';
import { toastError } from '#/lib/toast';
import { useRouter } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const LinkToggleButton = ({ link }: { link: TLink }) => {
    const router = useRouter();
    const handleToggle = async () => {
        try {
            await toggleLinkStatus(link.id, link.status);
            router.invalidate();
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
