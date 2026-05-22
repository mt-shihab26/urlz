import type { TRange } from '#/lib/ranges';
import type { TClickItem } from '#/services/clicks';

import { RANGES } from '#/lib/ranges';
import { toastError } from '#/lib/toast';
import { getClicksData } from '#/services/clicks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { RangeTabs } from '#/components/composite/range-tabs';
import { Header } from '#/components/composite/site-header';
import { ClicksTable } from '#/components/screens/clicks/clicks-table';
import { DetailDrawer } from '#/components/screens/clicks/detail-drawer';

export const Route = createFileRoute('/dashboard/_auth/clicks')({
    head: () => ({ meta: [{ title: 'Clicks — urlz' }] }),
    validateSearch: (search) => ({
        range: (RANGES.includes(search.range as TRange) ? search.range : '30d') as TRange,
        page: Number(search.page ?? 1),
    }),
    loaderDeps: ({ search }) => ({ range: search.range, page: search.page }),
    loader: async ({ deps }) => {
        try {
            return await getClicksData(deps.page, deps.range);
        } catch (e) {
            toastError(e);
            return null;
        }
    },
    component: Clicks,
});

const Clicks = () => {
    const { range, page } = Route.useSearch();
    const data = Route.useLoaderData();
    const navigate = useNavigate();
    const [selectedClick, setSelectedClick] = useState<TClickItem | null>(null);

    const handleRangeChange = (r: TRange) => {
        navigate({ search: { range: r, page: 1 } });
    };

    const handlePage = (p: number) => {
        navigate({ search: (prev) => ({ ...prev, page: p }) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header
                title="Clicks"
                description="Full paginated click history"
                action={<RangeTabs range={range} onRange={handleRangeChange} />}
            />
            <div className="p-4 lg:p-6">
                <ClicksTable
                    result={data ?? null}
                    loading={false}
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
        </>
    );
};
