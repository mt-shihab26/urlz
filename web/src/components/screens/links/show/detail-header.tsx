import type { TRange } from '@/lib/ranges';
import type { TLink } from '@/types/models';

import { formatCode, formatDate } from '@/lib/formats';

import { CopyButton } from '@/components/composite/copy-button';
import { LinkStatusBadge } from '@/components/composite/link-status-badge';
import { RangeTabs } from '@/components/composite/range-tabs';
import { LinkDeleteButton } from '@/components/screens/links/link-delete-button';
import { LinkEditButton } from '@/components/screens/links/link-edit-button';
import { LinkOpenButton } from '@/components/screens/links/link-open-button';
import { LinkToggleButton } from '@/components/screens/links/link-toggle-button';
import { ChevronLeftIcon } from 'lucide-react';

export const DetailHeader = ({
    link,
    range,
    onRangeChange,
    onBack,
}: {
    link: TLink;
    range: TRange;
    onRangeChange: (range: TRange) => void;
    onBack: () => void;
}) => {
    return (
        <div className="flex flex-col gap-2 border-b px-4 py-4 lg:px-6">
            <button
                onClick={onBack}
                className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ChevronLeftIcon className="size-4" />
                Back to Links
            </button>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight">{link.title}</h1>
                        <LinkStatusBadge link={link} />
                    </div>
                    <div className="group mt-1 flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">{formatCode(link.code)}</span>
                        <CopyButton text={formatCode(link.code)} />
                        <span className="text-muted-foreground">·</span>
                        <span className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                            {link.url}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Updated {formatDate(link.updated)}</span>
                        {link.expires && (
                            <>
                                <span>·</span>
                                <span>Expires {formatDate(link.expires)}</span>
                            </>
                        )}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                        <LinkEditButton link={link} />
                        <LinkToggleButton link={link} />
                        <LinkOpenButton link={link} />
                        <LinkDeleteButton link={link} />
                    </div>
                </div>
                <RangeTabs range={range} onRange={onRangeChange} />
            </div>
        </div>
    );
};
