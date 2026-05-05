import type { TPlan } from '@/types/models';

export type TPlanDef = {
    plan: TPlan;
    name: string;
    price: string;
    description: string;
    features: string[];
    highlight?: boolean;
};

export const PLANS: TPlanDef[] = [
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
