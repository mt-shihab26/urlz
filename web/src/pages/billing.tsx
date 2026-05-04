import {
    createCheckoutSession,
    syncCheckoutSession,
    syncPortalReturn,
} from '@/collections/billing';

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
import { Subscription } from '@/components/screens/billing/subscription';

const Billing = () => {
    const { user } = useUser();

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);
    const [coupon, setCoupon] = useState('');

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
                })
                .catch(() => toastError('Failed to sync subscription. Please refresh.'));
        }
    }, []);

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
                <Subscription user={user} />
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
