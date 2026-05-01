import { Card, CardHeader } from '@/components/ui/card';

type LinkDetailStat = {
    label: string;
    value: string;
};

export const LinkDetailStats = ({ stats }: { stats: LinkDetailStat[] }) => {
    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="pb-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-mono text-2xl font-bold tabular-nums">{stat.value}</p>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};
