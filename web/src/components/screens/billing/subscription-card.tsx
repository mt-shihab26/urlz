import type { TSubscription } from '@/collections/billing';
import type { TSubscriptionStatus, TUser } from '@/types/models';

import { createCancelFlowSession, createPortalSession } from '@/collections/billing';
import { toastError } from '@/lib/toast';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatLocaleDate } from '@/lib/formats';

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

export const SubscriptionCard = ({ user, sub }: { user: TUser; sub?: TSubscription | null }) => {
    const [loading, setLoading] = useState<LoadingAction>(null);

    const plan = user.plan || 'free';
    // Prefer live Stripe status from billing info over stale PB value
    const stripeStatus = sub?.status as TSubscriptionStatus | undefined;
    const status = (stripeStatus ?? user.subscription_status) as TSubscriptionStatus | undefined;
    const alreadyCanceled = stripeStatus === 'canceled' || status === 'canceled';
    const canceling = !!sub?.cancel_at_period_end;
    const canCancel =
        !alreadyCanceled && plan !== 'free' && (status === 'active' || status === 'trialing');

    const cancelDate = sub?.cancel_at
        ? formatLocaleDate(sub.cancel_at)
        : sub?.current_period_end
          ? formatLocaleDate(sub.current_period_end)
          : null;

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
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold">{PLAN_LABEL[plan] ?? plan}</span>
                        {status && (
                            <Badge variant={STATUS_VARIANT[status] ?? 'outline'}>
                                {STATUS_LABEL[status] ?? status}
                            </Badge>
                        )}
                    </div>
                    {plan !== 'free' && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleManage} disabled={!!loading}>
                                {loading === 'manage' ? 'Opening…' : 'Manage'}
                            </Button>
                            {canCancel && (
                                <Button
                                    variant="destructive"
                                    onClick={handleCancel}
                                    disabled={!!loading || canceling}
                                    title={
                                        canceling
                                            ? 'Subscription already scheduled for cancellation'
                                            : undefined
                                    }
                                >
                                    {loading === 'cancel' ? 'Opening…' : 'Cancel plan'}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {canceling && !alreadyCanceled && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Your subscription is scheduled to cancel
                        {cancelDate ? ` on ${cancelDate}` : ' at the end of the billing period'}.
                        You'll keep access until then.
                    </p>
                )}
                {alreadyCanceled && (
                    <p className="text-sm text-muted-foreground">
                        Your subscription has been canceled. Upgrade below to reactivate.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
