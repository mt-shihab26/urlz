import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

import { CheckIcon, CopyIcon } from 'lucide-react';

export const CopyButton = ({ text }: { text: string }) => {
    const [copiedText, handleCopy] = useCopyToClipboard();

    return (
        <button
            onClick={() => handleCopy(text)}
            className={cn(
                'p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground',
                copiedText === text && 'text-green-600 dark:text-green-400 opacity-100',
            )}
        >
            {copiedText === text ? (
                <CheckIcon className="size-3" />
            ) : (
                <CopyIcon className="size-3" />
            )}
        </button>
    );
};
