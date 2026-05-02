import type { TLink } from '@/types/models';
import type { TFilter } from '@/types/utils';

import { isLinkActive, isLinkDisabled, isLinkExpired } from '@/lib/links';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const filterEntries: { key: TFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'expired', label: 'Expired' },
];

export const FiltersToggle = ({
    links,
    filter,
    onFilter,
}: {
    links: TLink[];
    filter: TFilter;
    onFilter: (filter: TFilter) => void;
}) => {
    const counts = {
        all: links.length,
        active: links.filter(isLinkActive).length,
        disabled: links.filter(isLinkDisabled).length,
        expired: links.filter(isLinkExpired).length,
    };

    return (
        <ToggleGroup
            multiple={false}
            value={filter ? [filter] : []}
            onValueChange={(v) => onFilter((v[0] as TFilter) ?? 'all')}
            variant="outline"
            size="sm"
        >
            {filterEntries.map(({ key, label }) => (
                <ToggleGroupItem key={key} value={key}>
                    {label} <span className="ml-1 text-muted-foreground">{counts[key]}</span>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
