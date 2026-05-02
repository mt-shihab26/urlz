import type { TLink } from '@/types/models';

import { useMemo } from 'react';

import { TopCountriesCard } from '@/components/screens/links/show/top-countries-card';

export const AnalyticsCountries = ({ links }: { links: TLink[] }) => {
    const countries = useMemo(() => {
        const map = new Map<string, { country: string; code: string; clicks: number }>();
        links.forEach((link) =>
            link.countries.forEach(({ country, code, clicks }) => {
                const prev = map.get(code);
                map.set(code, { country, code, clicks: (prev?.clicks ?? 0) + clicks });
            }),
        );
        const total = Array.from(map.values()).reduce((s, c) => s + c.clicks, 0) || 1;
        return Array.from(map.values())
            .sort((a, b) => b.clicks - a.clicks)
            .map((c) => ({ ...c, pct: Math.round((c.clicks / total) * 100) }));
    }, [links]);

    return <TopCountriesCard countries={countries} />;
};
