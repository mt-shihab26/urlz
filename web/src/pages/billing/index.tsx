import type { TPlan } from '@/types/models';

import { createCheckoutSession, syncCheckoutSession } from '@/collections/billing';
import { useUser } from '@/components/providers/auth-provider';
import { pb } from '@/lib/pb';
import { toastError } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PlanCards } from '@/components/screens/billing/plan-card';
import { SubscriptionCard } from '@/components/screens/billing/subscription-card';
import { toast } from 'sonner';

const Billing = () => {
    const { user } = useUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (searchParams.get('success') === '1' && sessionId) {
            setSearchParams({}, { replace: true });
            syncCheckoutSession(sessionId)
                .then(() =>
                    pb
                        .collection('users')
                        .authRefresh()
                        .catch(() => {}),
                )
                .then(() => toast.success('Subscription activated!'))
                .catch(() => toast.error('Failed to activate plan. Contact support.'));
        }
    }, []);

    const handleUpgrade = async (plan: TPlan) => {
        setLoading(plan);
        try {
            const url = await createCheckoutSession(plan);
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
                <SubscriptionCard user={user} />
                <PlanCards
                    currentPlan={user.plan || 'free'}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                />
            </div>
        </DashboardLayout>
    );
};

export default Billing;
