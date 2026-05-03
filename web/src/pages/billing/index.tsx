import type { TBillingInfo } from '@/collections/billing';
import type { TPlan } from '@/types/models';

import {
    createCheckoutSession,
    getBillingInfo,
    syncCheckoutSession,
    syncPortalReturn,
} from '@/collections/billing';
import { useUser } from '@/components/providers/auth-provider';
import { pb } from '@/lib/pb';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { InvoicesTable } from '@/components/screens/billing/invoices-table';
import { PlanCards } from '@/components/screens/billing/plan-card';
import { SubscriptionDetailCard } from '@/components/screens/billing/subscription-detail-card';
import { SubscriptionCard } from '@/components/screens/billing/subscription-card';
import { toast } from 'sonner';

const Billing = () => {
    const { user } = useUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);
    const [coupon, setCoupon] = useState('');
    const [billingInfo, setBillingInfo] = useState<TBillingInfo | null>(null);

    const fetchBillingInfo = () => {
        if (user.plan && user.plan !== 'free') {
            getBillingInfo()
                .then(setBillingInfo)
                .catch(() => {});
        }
    };

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const portalReturn = searchParams.get('portal_return');

        if (searchParams.get('success') === '1' && sessionId) {
            setSearchParams({}, { replace: true });
            syncCheckoutSession(sessionId)
                .then(() => pb.collection('users').authRefresh().catch(() => {}))
                .then(() => {
                    toast.success('Subscription activated!');
                    fetchBillingInfo();
                })
                .catch(() => toast.error('Failed to activate plan. Contact support.'));
            return;
        }

        if (portalReturn === '1') {
            setSearchParams({}, { replace: true });
            syncPortalReturn()
                .then(() => pb.collection('users').authRefresh().catch(() => {}))
                .then(() => {
                    toast.success('Subscription updated!');
                    fetchBillingInfo();
                })
                .catch(() => toast.error('Failed to sync subscription. Please refresh.'));
        }
    }, []);

    useEffect(() => {
        fetchBillingInfo();
    }, [user.plan]);

    const handleUpgrade = async (plan: TPlan) => {
        setLoading(plan);
        try {
            const url = await createCheckoutSession(plan, coupon.trim() || undefined);
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to start checkout');
            setLoading(null);
        }
    };

    return (
        <DashboardLayout title="Billing">
            <Header title="Billing" description="Manage your subscription and plan" />
            <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-4xl">
                <SubscriptionCard user={user} sub={billingInfo?.subscription} />
                {billingInfo?.subscription && (
                    <SubscriptionDetailCard sub={billingInfo.subscription} />
                )}
                <PlanCards
                    currentPlan={user.plan || 'free'}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                    coupon={coupon}
                    onCouponChange={setCoupon}
                />
                {billingInfo && (
                    <InvoicesTable invoices={billingInfo.invoices} />
                )}
            </div>
        </DashboardLayout>
    );
};

export default Billing;
