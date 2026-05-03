import type { TPlan } from '@/types/models';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckIcon, TagIcon } from 'lucide-react';

type PlanDef = {
    plan: TPlan;
    name: string;
    price: string;
    description: string;
    features: string[];
    highlight?: boolean;
};

const PLANS: PlanDef[] = [
    {
        plan: 'free',
        name: 'Free',
        price: '$0',
        description: 'Get started with the basics.',
        features: ['5 short links', 'Basic click analytics', 'Custom slugs'],
    },
    {
        plan: 'pro',
        name: 'Pro',
        price: '$9/mo',
        description: 'For creators and small teams.',
        features: [
            'Unlimited short links',
            'Full analytics & charts',
            'Custom slugs',
            'Link expiry dates',
            'Priority support',
        ],
        highlight: true,
    },
    {
        plan: 'business',
        name: 'Business',
        price: '$29/mo',
        description: 'For teams that need more power.',
        features: [
            'Everything in Pro',
            'Team members (coming soon)',
            'API access (coming soon)',
            'Custom domains (coming soon)',
            'Dedicated support',
        ],
    },
];

export const PlanCards = ({
    currentPlan,
    onUpgrade,
    loading,
    coupon,
    onCouponChange,
}: {
    currentPlan: TPlan;
    onUpgrade: (plan: TPlan) => void;
    loading: TPlan | null;
    coupon: string;
    onCouponChange: (v: string) => void;
}) => (
    <div className="flex flex-col gap-4">
        {currentPlan === 'free' && (
            <div className="flex items-center gap-2 max-w-xs">
                <TagIcon className="size-4 shrink-0 text-muted-foreground" />
                <Input
                    placeholder="Coupon code (optional)"
                    value={coupon}
                    onChange={(e) => onCouponChange(e.target.value)}
                    className="h-8 text-sm"
                />
            </div>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
                <Card
                    key={p.plan}
                    className={cn(
                        'flex flex-col',
                        p.highlight && 'border-primary shadow-md',
                        currentPlan === p.plan && 'ring-2 ring-primary',
                    )}
                >
                    <CardHeader>
                        {p.highlight && (
                            <span className="mb-1 w-fit rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                Popular
                            </span>
                        )}
                        <CardTitle className="text-lg">{p.name}</CardTitle>
                        <p className="text-2xl font-bold">{p.price}</p>
                        <p className="text-sm text-muted-foreground">{p.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2">
                            {p.features.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm">
                                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {currentPlan === p.plan ? (
                            <Button className="w-full" variant="outline" disabled>
                                Current plan
                            </Button>
                        ) : p.plan === 'free' ? (
                            <Button className="w-full" variant="outline" disabled>
                                Downgrade via portal
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                variant={p.highlight ? 'default' : 'outline'}
                                onClick={() => onUpgrade(p.plan)}
                                disabled={!!loading}
                            >
                                {loading === p.plan ? 'Redirecting…' : `Upgrade to ${p.name}`}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
);
