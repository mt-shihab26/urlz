import {
    createCheckoutSession,
    getBillingInfo,
    syncCheckoutSession,
    syncPortalReturn,
} from '@/collections/billing';

import type { TBillingInfo } from '@/collections/billing';
import type { TPlan } from '@/types/models';

import { useUser } from '@/components/providers/auth-provider';
import { pb } from '@/lib/pb';
import { toastError, toastSuccess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Invoices } from '@/components/screens/billing/invoices';
import { PlanCards } from '@/components/screens/billing/plan-card';
import { SubscriptionCard } from '@/components/screens/billing/subscription-card';
import { SubscriptionDetail } from '@/components/screens/billing/subscription-detail-card';

const Billing = () => {
    const { user } = useUser();

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);
    const [coupon, setCoupon] = useState('');
    const [billingInfo, setBillingInfo] = useState<TBillingInfo | null>(null);

    const fetchBillingInfo = async (autoSync = false) => {
        try {
            const info = await getBillingInfo();
            setBillingInfo(info);
            // Stripe says canceled but PB still shows paid plan — auto sync
            if (
                autoSync &&
                user.plan !== 'free' &&
                (!info.subscription || info.subscription.status === 'canceled')
            ) {
                await syncPortalReturn().catch(() => {});
                await pb
                    .collection('users')
                    .authRefresh()
                    .catch(() => {});
            }
        } catch {}
    };

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const portalReturn = searchParams.get('portal_return');

        if (searchParams.get('success') === '1' && sessionId) {
            setSearchParams({}, { replace: true });
            syncCheckoutSession(sessionId)
                .then(() =>
                    pb
                        .collection('users')
                        .authRefresh()
                        .catch(() => {}),
                )
                .then(() => {
                    toastSuccess('Subscription activated!');
                    fetchBillingInfo();
                })
                .catch(() => toastError('Failed to activate plan. Contact support.'));
            return;
        }

        if (portalReturn === '1') {
            setSearchParams({}, { replace: true });
            syncPortalReturn()
                .then(() =>
                    pb
                        .collection('users')
                        .authRefresh()
                        .catch(() => {}),
                )
                .then(() => {
                    toastSuccess('Subscription updated!');
                    fetchBillingInfo();
                })
                .catch(() => toastError('Failed to sync subscription. Please refresh.'));
        }
    }, []);

    useEffect(() => {
        fetchBillingInfo(true);
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
                    <SubscriptionDetail subscription={billingInfo.subscription} />
                )}
                <PlanCards
                    currentPlan={user.plan || 'free'}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                    coupon={coupon}
                    onCouponChange={setCoupon}
                />
                <Invoices />
            </div>
        </DashboardLayout>
    );
};

export default Billing;
