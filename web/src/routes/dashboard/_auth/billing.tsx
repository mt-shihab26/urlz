import { createFileRoute } from '@tanstack/react-router';

import { Header } from '#/components/composite/site-header';
import { Invoices } from '#/components/screens/billing/invoices';
import { Plans } from '#/components/screens/billing/plans';
import { Subscription } from '#/components/screens/billing/subscription';

export const Route = createFileRoute('/dashboard/_auth/billing')({
    head: () => ({ meta: [{ title: 'Billing — urlz' }] }),
    component: Billing,
});

function Billing() {
    return (
        <>
            <Header title="Billing" description="Manage your subscription and plan" />
            <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-4xl">
                <Plans />
                <Subscription />
                <Invoices />
            </div>
        </>
    );
}
