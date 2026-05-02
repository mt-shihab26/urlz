export const Sparkline = ({
    data,
    width = 80,
    height = 28,
}: {
    data: { clicks: number }[];
    width?: number;
    height?: number;
}) => {
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
};
