import type { TRange } from '@/lib/ranges';
import type { TClick, TLink } from '@/types/models';

import { subscribeClicksPage, unsubscribeClicksPage, type TClicksPage } from '@/collections/clicks';
import { subscribeLinks, unsubscribeLinks } from '@/collections/links';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';

import { RangeTabs } from '@/components/composite/range-tabs';
import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ClicksTable, PER_PAGE } from '@/components/screens/clicks/clicks-table';
import { DetailDrawer } from '@/components/screens/clicks/detail-drawer';

const Clicks = () => {
    const [range, setRange] = useState<TRange>('30d');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<TClicksPage | null>(null);
    const [links, setLinks] = useState<TLink[]>([]);
    const [selectedClick, setSelectedClick] = useState<TClick | null>(null);

    useEffect(() => {
        subscribeLinks('All', {
            onData: setLinks,
            onError: toastError,
        });
        return () => {
            unsubscribeLinks({ onError: toastError });
        };
    }, []);

    useEffect(() => {
        setPage(1);
    }, [range]);

    useEffect(() => {
        subscribeClicksPage(page, PER_PAGE, range, {
            onData: setResult,
            onError: toastError,
            onLoading: setLoading,
        });
        return () => {
            unsubscribeClicksPage({ onError: toastError });
        };
    }, [page, range]);

    const handlePage = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const linkMap = new Map(links.map((l) => [l.id, l]));

    return (
        <DashboardLayout title="Clicks">
            <Header
                title="Clicks"
                description="Full paginated click history"
                action={<RangeTabs range={range} onRange={setRange} />}
            />
            <div className="p-4 lg:p-6">
                <ClicksTable
                    result={result}
                    links={links}
                    loading={loading}
                    page={page}
                    onPage={handlePage}
                    onClickRow={setSelectedClick}
                />
            </div>
            <DetailDrawer
                click={selectedClick}
                link={selectedClick ? linkMap.get(selectedClick.link) : undefined}
                open={selectedClick !== null}
                onClose={() => setSelectedClick(null)}
            />
        </DashboardLayout>
    );
};

export default Clicks;
