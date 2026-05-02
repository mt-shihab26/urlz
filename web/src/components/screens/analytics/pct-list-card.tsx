import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PctItem = { name: string; pct: number; color: string };

export const PctListCard = ({ title, data }: { title: string; data: PctItem[] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {data.length === 0 ? (
                    <p className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                        No data yet
                    </p>
                ) : (
                    data.map((d) => (
                        <div key={d.name} className="flex items-center gap-2.5">
                            <span
                                className="size-2.5 shrink-0 rounded-sm"
                                style={{ background: d.color }}
                            />
                            <span className="flex-1 text-sm">{d.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                                {d.pct}%
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};
