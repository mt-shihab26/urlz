import { Skeleton } from '@/components/ui/skeleton';

export const LinksPageSkeleton = () => {
    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-10 w-80 max-w-xs" />
                <Skeleton className="h-9 w-96 max-w-full" />
            </div>
            <div className="overflow-hidden rounded-xl border">
                <div className="border-b px-4 py-3">
                    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_100px_100px_110px_100px_48px] gap-4">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
                <div className="divide-y">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_100px_100px_110px_100px_48px] gap-4 px-4 py-4"
                        >
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-full max-w-52" />
                            </div>
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-18 rounded-full" />
                            <Skeleton className="h-8 w-8 justify-self-end rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
