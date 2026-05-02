import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { TopCountriesCard } from '@/components/screens/links/show/top-countries-card';

export const AnalyticsCountries = ({ links }: { links: TLink[] }) => {
    const allClicks = useMemo(() => links.flatMap((l) => l.clicks), [links]);
    return <TopCountriesCard clicks={allClicks} />;
};
