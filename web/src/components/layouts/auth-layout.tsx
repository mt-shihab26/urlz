import { LinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
            <div className="mb-6 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                    <LinkIcon className="size-4 text-primary-foreground" />
                </div>
                <Link to="/" className="text-lg font-bold tracking-tight">
                    urlz
                </Link>
            </div>
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
};
