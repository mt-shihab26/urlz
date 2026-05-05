import type { TPlan } from '@/types/models';
import type { TPlanDef } from './list';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';

export const PlanCard = ({
    plan,
    currentPlan,
    onUpgrade,
    loading,
}: {
    plan: TPlanDef;
    currentPlan: TPlan;
    onUpgrade: (plan: TPlan) => void;
    loading: TPlan | null;
}) => {
    return (
        <Card
            key={plan.plan}
            className={cn(
                'flex flex-col',
                plan.highlight && 'border-primary shadow-md',
                currentPlan === plan.plan && 'ring-2 ring-primary',
            )}
        >
            <CardHeader>
                {plan.highlight && (
                    <span className="mb-1 w-fit rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Popular
                    </span>
                )}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-2xl font-bold">{plan.price}</p>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-2">
                    {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                            <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                            {f}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                {currentPlan === plan.plan ? (
                    <Button className="w-full" variant="outline" disabled>
                        Current plan
                    </Button>
                ) : plan.plan === 'free' ? (
                    <Button className="w-full" variant="outline" disabled>
                        Downgrade via portal
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        variant={plan.highlight ? 'default' : 'outline'}
                        onClick={() => onUpgrade(plan.plan)}
                        disabled={!!loading}
                    >
                        {loading === plan.plan ? 'Redirecting…' : `Upgrade to ${plan.name}`}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};
