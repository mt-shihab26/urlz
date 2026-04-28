import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export const Header = ({ title, description, action, className }: HeaderProps) => {
    return (
        <header
            className={cn(
                'flex shrink-0 items-start gap-2 border-b px-4 py-4 lg:px-6',
                className,
            )}
        >
            <div className="flex w-full items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
            </div>
        </header>
    );
};
