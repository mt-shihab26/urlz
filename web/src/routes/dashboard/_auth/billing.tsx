import type { TInvoice, TSubscription } from '#/collections/billing';

import { getInvoices, getSubscription } from '#/collections/billing';
import { toastError } from '#/lib/toast';
import { createFileRoute } from '@tanstack/react-router';

import { Header } from '#/components/composite/site-header';
import { Invoices } from '#/components/screens/billing/invoices';
import { Plans } from '#/components/screens/billing/plans';
import { Subscription } from '#/components/screens/billing/subscription';
import { head } from '#/lib/utils';

export const Route = createFileRoute('/dashboard/_auth/billing')({
    head: () => head('Billing'),
    loader: async () => {
        const [subscriptionResult, invoicesResult] = await Promise.allSettled([
            getSubscription(),
            getInvoices(),
        ]);
        const subscription: TSubscription | null =
            subscriptionResult.status === 'fulfilled' ? subscriptionResult.value : null;
        const invoices: TInvoice[] =
            invoicesResult.status === 'fulfilled' ? invoicesResult.value : [];

        if (subscriptionResult.status === 'rejected') toastError(subscriptionResult.reason);
        if (invoicesResult.status === 'rejected') toastError(invoicesResult.reason);

        return { subscription, invoices };
    },
    component: Billing,
});

const Billing = () => {
    const { subscription, invoices } = Route.useLoaderData();

    return (
        <>
            <Header title="Billing" description="Manage your subscription and plan" />
            <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-4xl">
                <Plans />
                <Subscription subscription={subscription} />
                <Invoices invoices={invoices} />
            </div>
        </>
    );
};
