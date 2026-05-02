import { Skeleton } from '@/components/ui/skeleton';

export const AnalyticsSkeleton = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-xl border p-6">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-7 w-28" />
                    </div>
                ))}
            </div>
            <div className="rounded-xl border p-6 flex flex-col gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-[200px] w-full" />
            </div>
            <div className="rounded-xl border overflow-hidden">
                <div className="border-b px-6 py-4">
                    <Skeleton className="h-5 w-28" />
                </div>
                <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-2 w-40 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-xl border p-6 flex flex-col gap-3">
                        <Skeleton className="h-5 w-28" />
                        {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton key={j} className="h-4 w-full" />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};
