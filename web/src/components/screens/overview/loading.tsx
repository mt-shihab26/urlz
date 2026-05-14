import { Skeleton } from '#/components/ui/skeleton';

export const Loading = () => {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border p-6 flex flex-col gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
            <div className="border p-6 flex flex-col gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-50 w-full" />
            </div>
            <div className="border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <Skeleton className="h-5 w-24" />
                </div>
                <div className="divide-y">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4">
                            <Skeleton className="size-6 shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-6 w-18" />
                            <Skeleton className="h-5 w-14" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
