import { LoaderCircleIcon } from 'lucide-react';

export function PageLoader() {
    return (
        <div className="flex min-h-svh items-center justify-center">
            <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
}
