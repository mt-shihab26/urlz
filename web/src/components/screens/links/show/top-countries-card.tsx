import { CountryBar } from '@/components/composite/urlz-ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TLinkCountry } from '@/types/models';

type TopCountriesCardProps = {
    countries: TLinkCountry[];
};

export const TopCountriesCard = ({ countries }: TopCountriesCardProps) => {
    const maxCountryPct = countries[0]?.pct ?? 100;

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
                    countries.slice(0, 6).map((country) => (
                        <CountryBar
                            key={country.code}
                            code={country.code}
                            pct={country.pct}
                            max={maxCountryPct}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};
