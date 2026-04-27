import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ChartAreaInteractive } from '@/components/screens/dashboard-page/chart-area-interactive';
import { DataTable } from '@/components/screens/dashboard-page/data-table';
import { SectionCards } from '@/components/screens/dashboard-page/section-cards';

import data from '@/lib/data.json';

export const Dashboard = () => {
    return (
        <DashboardLayout>
            <Header />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={data} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
