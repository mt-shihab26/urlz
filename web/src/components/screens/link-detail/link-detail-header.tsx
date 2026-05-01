import { StatusBadge } from '@/components/composite/urlz-ui';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeftIcon } from 'lucide-react';

import type { TLink } from '@/types/models';

const RANGES = ['7d', '30d', '90d', 'All'] as const;

export type LinkDetailRange = (typeof RANGES)[number];

type LinkDetailHeaderProps = {
    link: TLink;
    range: LinkDetailRange;
    onRangeChange: (range: LinkDetailRange) => void;
    onBack: () => void;
};

export const LinkDetailHeader = ({
    link,
    range,
    onRangeChange,
    onBack,
}: LinkDetailHeaderProps) => {
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
                    <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">urlz.io/{link.code}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                            {link.url}
                        </span>
                    </div>
                </div>
                <ToggleGroup
                    multiple={false}
                    value={range ? [range] : []}
                    onValueChange={(value) => onRangeChange((value[0] as LinkDetailRange) ?? '30d')}
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
