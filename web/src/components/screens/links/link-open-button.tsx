import type { TLink } from '@/types/models';

import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

export const LinkOpenButton = ({ link }: { link: TLink }) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Open"
            onClick={() => window.open(link.url, '_blank')}
        >
            <ExternalLinkIcon className="size-3.5" />
        </Button>
    );
};
