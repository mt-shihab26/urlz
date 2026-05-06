import type { TBreakdownItem } from '@/types/utils';

import { formatNumber } from '@/lib/formats';

export const BreakdownList = ({ items, empty }: { items: TBreakdownItem[]; empty: string }) => {
    const max = items[0]?.count ?? 1;
    return (
        <div className="flex flex-col gap-2.5">
            {items.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{empty}</p>
            ) : (
                items.map(({ label, count }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 truncate text-sm" title={label}>
                            {label}
                        </span>
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.round((count / max) * 100)}%` }}
                            />
                        </div>
                        <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                            {formatNumber(count)}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};
