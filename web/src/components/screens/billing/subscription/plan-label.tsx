import type { TUser } from '@/types/models';

const PLAN_LABEL: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    business: 'Business',
};

export const PlanLavel = ({ user }: { user: TUser }) => {
    const plan = user.plan || 'free';

    return <span className="text-xl font-semibold">{PLAN_LABEL[plan] ?? plan}</span>;
};
