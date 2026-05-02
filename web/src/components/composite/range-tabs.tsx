import type { TRange } from '@/lib/ranges';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { RANGES } from '@/lib/ranges';

export const RangeTabs = ({
    range,
    onRange,
}: {
    range: TRange;
    onRange: (range: TRange) => void;
}) => {
    return (
        <ToggleGroup
            multiple={false}
            value={range ? [range] : []}
            onValueChange={(v) => onRange((v[0] as TRange) ?? '30d')}
            variant="outline"
            size="sm"
        >
            {RANGES.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                    {r}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
