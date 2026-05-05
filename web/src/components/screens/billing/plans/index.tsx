import { useUser } from '@/components/providers/auth-provider';
import { useHandleUpgrade } from '@/hooks/use-handle-upgrade';
import { getCurrentPlan } from '@/lib/billing';

import { PlanCard } from './plan-card';

import { PLANS } from './list';

export const Plans = () => {
    const { user } = useUser();
    const { handleUpgrade, loading } = useHandleUpgrade();

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
                <PlanCard
                    key={plan.name}
                    plan={plan}
                    currentPlan={getCurrentPlan(user)}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                />
            ))}
        </div>
    );
};
