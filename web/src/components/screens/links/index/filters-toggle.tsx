import type { TLink, TLinkStatus } from '@/types/models';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type TFilter = 'all' | TLinkStatus | 'expired';

const filterEntries: { key: TFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled' },
    { key: 'expired', label: 'Expired' },
];

const isExpired = (link: TLink) => !!link.expires && new Date(link.expires) < new Date();

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
        active: links.filter((l) => l.status === 'active' && !isExpired(l)).length,
        disabled: links.filter((l) => l.status === 'disabled' && !isExpired(l)).length,
        expired: links.filter(isExpired).length,
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
