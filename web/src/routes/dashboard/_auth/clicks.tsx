import type { TRange } from '#/lib/ranges';
import type { TClickItem, TResponse } from '#/services/clicks';

import { queryKeys } from '#/lib/query-keys';
import { toastError } from '#/lib/toast';
import { getClicksData } from '#/services/clicks';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { RangeTabs } from '#/components/composite/range-tabs';
import { Header } from '#/components/composite/site-header';
import { DashboardLayout } from '#/components/layouts/dashboard-layout';
import { ClicksTable } from '#/components/screens/clicks/clicks-table';
import { DetailDrawer } from '#/components/screens/clicks/detail-drawer';

export const Route = createFileRoute('/dashboard/_auth/clicks')({
    component: Clicks,
});

function Clicks() {
    const [range, setRange] = useState<TRange>('30d');
    const [page, setPage] = useState(1);
    const [selectedClick, setSelectedClick] = useState<TClickItem | null>(null);

    const { data, isLoading } = useQuery<TResponse>({
        queryKey: queryKeys.clicks(page, range),
        queryFn: () => getClicksData(page, range),
        throwOnError: (e) => toastError(e),
    });

    const handleRangeChange = (r: TRange) => {
        setRange(r);
        setPage(1);
    };

    const handlePage = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <DashboardLayout title="Clicks">
            <Header
                title="Clicks"
                description="Full paginated click history"
                action={<RangeTabs range={range} onRange={handleRangeChange} />}
            />
            <div className="p-4 lg:p-6">
                <ClicksTable
                    result={data ?? null}
                    loading={isLoading}
                    page={page}
                    onPage={handlePage}
                    onClickRow={setSelectedClick}
                />
            </div>
            <DetailDrawer
                click={selectedClick}
                open={selectedClick !== null}
                onClose={() => setSelectedClick(null)}
            />
        </DashboardLayout>
    );
}
