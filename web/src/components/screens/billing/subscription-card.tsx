import type { TSubscriptionInfo } from '@/collections/billing';
import type { TSubscriptionStatus, TUser } from '@/types/models';

import { createCancelFlowSession, createPortalSession } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_LABEL: Record<TSubscriptionStatus, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past due',
    canceled: 'Canceled',
    unpaid: 'Unpaid',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    paused: 'Paused',
};

const STATUS_VARIANT: Record<
    TSubscriptionStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    active: 'default',
    trialing: 'secondary',
    past_due: 'destructive',
    canceled: 'outline',
    unpaid: 'destructive',
    incomplete: 'secondary',
    incomplete_expired: 'destructive',
    paused: 'secondary',
};

const PLAN_LABEL: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    business: 'Business',
};

type LoadingAction = 'manage' | 'cancel' | null;

export const SubscriptionCard = ({
    user,
    sub,
}: {
    user: TUser;
    sub?: TSubscriptionInfo | null;
}) => {
    const [loading, setLoading] = useState<LoadingAction>(null);

    const plan = user.plan || 'free';
    const status = user.subscription_status;
    const isActive =
        plan !== 'free' && (status === 'active' || status === 'trialing') && !sub?.cancel_at_period_end;

    const handleManage = async () => {
        setLoading('manage');
        try {
            const url = await createPortalSession();
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to open billing portal');
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        setLoading('cancel');
        try {
            const url = await createCancelFlowSession();
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to open cancellation');
            setLoading(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold">{PLAN_LABEL[plan] ?? plan}</span>
                    {status && (
                        <Badge variant={STATUS_VARIANT[status] ?? 'outline'}>
                            {STATUS_LABEL[status] ?? status}
                        </Badge>
                    )}
                    {sub?.cancel_at_period_end && (
                        <Badge variant="outline">
                            Cancels{' '}
                            {sub.cancel_at
                                ? new Date(sub.cancel_at * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' })
                                : sub.current_period_end
                                  ? new Date(sub.current_period_end * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' })
                                  : 'at period end'}
                        </Badge>
                    )}
                </div>
                {plan !== 'free' && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleManage}
                            disabled={!!loading}
                        >
                            {loading === 'manage' ? 'Opening…' : 'Manage'}
                        </Button>
                        {isActive && (
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                                disabled={!!loading}
                            >
                                {loading === 'cancel' ? 'Opening…' : 'Cancel'}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
