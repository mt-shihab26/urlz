import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
    return (
        <div className="flex min-h-svh items-center justify-center">
            <Loader2 className="size-52 animate-spin text-primary" />
        </div>
    );
};
