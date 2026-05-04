import type { ReactNode } from 'react';

export const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between py-1.5 text-sm border-b last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);
