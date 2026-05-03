import { Skeleton } from '@/components/ui/skeleton';

export const Loading = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 border-b px-4 py-4 lg:px-6">
                <Skeleton className="h-4 w-28" />
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>
                    <Skeleton className="h-9 w-48" />
                </div>
            </div>

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="border p-6">
                            <Skeleton className="mb-3 h-4 w-24" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>

                <div className="border p-6">
                    <Skeleton className="mb-6 h-5 w-36" />
                    <Skeleton className="h-64 w-full" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="border p-6">
                            <Skeleton className="mb-6 h-5 w-32" />
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 5 }).map((__, rowIndex) => (
                                    <Skeleton key={rowIndex} className="h-8 w-full" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
