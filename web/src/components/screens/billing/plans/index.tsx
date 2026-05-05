import { createCheckoutUrl, syncCheckoutSession, syncPortalReturn } from '@/collections/billing';

import type { TPlan } from '@/types/models';

import { useUser } from '@/components/providers/auth-provider';
import { pb } from '@/lib/pb';
import { toastError, toastSuccess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PlanCard } from './plan-card';

import { PLANS } from './list';

export const Plans = () => {
    const { user } = useUser();

    const currentPlan = user.plan || 'free';

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<TPlan | null>(null);

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
            const url = await createCheckoutUrl(plan);
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to start checkout');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
                <PlanCard
                    key={plan.name}
                    plan={plan}
                    currentPlan={currentPlan}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                />
            ))}
        </div>
    );
};
