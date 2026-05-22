import type { TLinkCounts } from '#/services/links';
import type { TFilter } from '#/types/utils';

import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group';

const filterEntries: { key: TFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'expired', label: 'Expired' },
];

export const FiltersTabs = ({
    counts,
    filter,
    onFilter,
}: {
    counts: TLinkCounts;
    filter: TFilter;
    onFilter: (filter: TFilter) => void;
}) => {

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
