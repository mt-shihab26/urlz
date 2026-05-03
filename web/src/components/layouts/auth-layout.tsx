import logo from '@/assets/logo.svg';
import { route } from '@/routes';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
            <div className="mb-6 flex items-center gap-2">
                <img src={logo} alt="urlz" className="size-8" />
                <Link to={route.overviewIndex()} className="text-lg font-bold tracking-tight">
                    urlz
                </Link>
            </div>
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
};
