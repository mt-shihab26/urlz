import type { TClickItem } from '#/services/clicks';

import { toastError } from '#/lib/toast';
import { head } from '#/lib/utils';
import { getClicksData } from '#/services/clicks';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

import { RangeTabs } from '#/components/composite/range-tabs';
import { Header } from '#/components/composite/site-header';
import { ClicksTable } from '#/components/screens/clicks/clicks-table';
import { DetailDrawer } from '#/components/screens/clicks/detail-drawer';

import { DEFAULT_RANGE, RANGES } from '#/lib/ranges';

const searchSchema = z.object({
    range: z.enum(RANGES).optional(),
    page: z.coerce.number().int().min(1).optional(),
});

export const Route = createFileRoute('/dashboard/_auth/clicks')({
    head: () => head('Clicks'),
    validateSearch: (search) => searchSchema.parse(search),
    loaderDeps: ({ search }) => ({
        range: search.range ?? DEFAULT_RANGE,
        page: search.page ?? 1,
    }),
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

function Clicks() {
    const { range = DEFAULT_RANGE, page = 1 } = Route.useSearch();
    const data = Route.useLoaderData();
    const navigate = Route.useNavigate();
    const [selectedClick, setSelectedClick] = useState<TClickItem | null>(null);

    const handleRangeChange = (r: (typeof RANGES)[number]) => {
        navigate({ search: { range: r, page: 1 } });
    };

    const handlePage = (p: number) => {
        navigate({ search: (prev) => ({ ...prev, page: p > 1 ? p : undefined }) });
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
}
