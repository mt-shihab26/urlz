import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { ReferrersCard } from '@/components/screens/links/show/referrers-card';

export const AnalyticsReferrers = ({ links }: { links: TLink[] }) => {
    const referrers = useMemo(() => {
        const map = new Map<string, number>();
        links.forEach((link) =>
            link.referrers.forEach(({ source, clicks }) =>
                map.set(source, (map.get(source) ?? 0) + clicks),
            ),
        );
        return Array.from(map.entries())
            .map(([source, clicks]) => ({ source, clicks }))
            .sort((a, b) => b.clicks - a.clicks);
    }, [links]);

    return <ReferrersCard referrers={referrers} />;
};
