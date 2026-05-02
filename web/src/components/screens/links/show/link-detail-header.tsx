import { CopyButton } from '@/components/composite/copy-button';
import { StatusBadge } from '@/components/composite/status-badge';
import { LinkDeleteButton } from '@/components/screens/links/index/link-delete-button';
import { LinkOpenButton } from '@/components/screens/links/index/link-open-button';
import { LinkToggleButton } from '@/components/screens/links/index/link-toggle-button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeftIcon } from 'lucide-react';

import { formatCode } from '@/lib/formats';
import type { TLink } from '@/types/models';

const RANGES = ['7d', '30d', '90d', 'All'] as const;

export type TLinkDetailRange = (typeof RANGES)[number];

type LinkDetailHeaderProps = {
    link: TLink;
    range: TLinkDetailRange;
    onRangeChange: (range: TLinkDetailRange) => void;
    onBack: () => void;
};

export const LinkDetailHeader = ({ link, range, onRangeChange, onBack }: LinkDetailHeaderProps) => {
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
                        <StatusBadge status={link.status} />
                    </div>
                    <div className="group mt-1 flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">{formatCode(link.code)}</span>
                        <CopyButton text={formatCode(link.code)} />
                        <span className="text-muted-foreground">·</span>
                        <span className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                            {link.url}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                        <LinkToggleButton link={link} />
                        <LinkOpenButton link={link} />
                        <LinkDeleteButton link={link} />
                    </div>
                </div>
                <ToggleGroup
                    multiple={false}
                    value={range ? [range] : []}
                    onValueChange={(value) =>
                        onRangeChange((value[0] as TLinkDetailRange) ?? '30d')
                    }
                    variant="outline"
                    size="sm"
                >
                    {RANGES.map((item) => (
                        <ToggleGroupItem key={item} value={item}>
                            {item}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
        </div>
    );
};
