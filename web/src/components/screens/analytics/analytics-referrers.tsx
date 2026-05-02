import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { ReferrersCard } from '@/components/screens/links/show/referrers-card';

export const AnalyticsReferrers = ({ links }: { links: TLink[] }) => {
    const allClicks = useMemo(() => links.flatMap((l) => l.clicks), [links]);
    return <ReferrersCard clicks={allClicks} />;
};
