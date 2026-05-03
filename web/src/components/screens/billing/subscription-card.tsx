import type { TSubscriptionStatus, TUser } from '@/types/models';

import { createPortalSession } from '@/collections/billing';
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

export const SubscriptionCard = ({ user }: { user: TUser }) => {
    const [loading, setLoading] = useState(false);

    const plan = user.plan ?? 'free';
    const status = user.subscription_status;

    const handleManage = async () => {
        setLoading(true);
        try {
            const url = await createPortalSession();
            window.location.href = url;
        } catch (e: any) {
            toastError(e?.message ?? 'Failed to open billing portal');
            setLoading(false);
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
                </div>
                {plan !== 'free' && (
                    <Button variant="outline" onClick={handleManage} disabled={loading}>
                        {loading ? 'Opening…' : 'Manage Subscription'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
