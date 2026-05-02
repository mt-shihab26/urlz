import type { TLinkStatus } from '@/types/models';

import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: TLinkStatus }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                status === 'active' && 'bg-green-500/10 text-green-600 dark:text-green-400',
                status === 'disabled' && 'bg-muted text-muted-foreground',
            )}
        >
            <span className="size-1.5 shrink-0 rounded-full bg-current" />
            {status === 'active' ? 'Active' : 'Disabled'}
        </span>
    );
}

export function Sparkline({
    data,
    width = 80,
    height = 28,
}: {
    data: { clicks: number }[];
    width?: number;
    height?: number;
}) {
    if (!data || data.length < 2) return null;
    const vals = data.map((d) => d.clicks);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const px = (i: number) => (i / (vals.length - 1)) * width;
    const py = (v: number) => height - 2 - ((v - min) / range) * (height - 4);
    let d = `M ${px(0)},${py(vals[0])}`;
    for (let i = 1; i < vals.length; i++) {
        const cx = (px(i - 1) + px(i)) / 2;
        d += ` C ${cx},${py(vals[i - 1])} ${cx},${py(vals[i])} ${px(i)},${py(vals[i])}`;
    }
    const trend = vals[vals.length - 1] > vals[0];
    const color = trend ? 'oklch(0.7 0.18 145)' : 'oklch(0.65 0.2 25)';
    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width, height }}>
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function CountryBar({ code, pct, max }: { code: string; pct: number; max: number }) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {code}
            </span>
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
}
