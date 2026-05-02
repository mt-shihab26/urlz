export const CountryBar = ({
    country,
    code,
    pct,
    max,
}: {
    country: string;
    code: string;
    pct: number;
    max: number;
}) => {
    return (
        <div className="flex items-center gap-2.5">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">{code}</span>
            <span className="w-28 shrink-0 truncate text-xs">{country}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(pct / max) * 100}%` }}
                />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {pct}%
            </span>
        </div>
    );
};
