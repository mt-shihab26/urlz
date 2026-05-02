import type { TClick } from '@/types/models';

import { useMemo } from 'react';

import { CountryBar } from '@/components/composite/country-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsCountries = ({ clicks }: { clicks: TClick[] }) => {
    const countries = useMemo(() => {
        const map = new Map<string, { country: string; code: string; count: number }>();
        clicks.forEach(({ country_name, country_code }) => {
            if (!country_code) return;
            const prev = map.get(country_code);
            map.set(country_code, {
                country: country_name,
                code: country_code,
                count: (prev?.count ?? 0) + 1,
            });
        });
        const total = clicks.filter((c) => c.country_code).length || 1;
        return Array.from(map.values())
            .sort((a, b) => b.count - a.count)
            .map((c) => ({ ...c, pct: Math.round((c.count / total) * 100) }));
    }, [clicks]);

    const maxPct = countries[0]?.pct ?? 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
                {countries.length === 0 ? (
                    <p className="h-24 text-center text-sm text-muted-foreground flex items-center justify-center">
                        No data yet
                    </p>
                ) : (
                    countries
                        .slice(0, 6)
                        .map((c) => (
                            <CountryBar
                                key={c.code}
                                country={c.country}
                                code={c.code}
                                pct={c.pct}
                                max={maxPct}
                            />
                        ))
                )}
            </CardContent>
        </Card>
    );
};
