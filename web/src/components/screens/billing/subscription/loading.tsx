import { Skeleton } from '@/components/ui/skeleton';

export const Loading = () => {
    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
            <div className="border-t pt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b last:border-0">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                ))}
            </div>
        </>
    );
};
