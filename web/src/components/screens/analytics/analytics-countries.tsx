import type { TClick } from '@/types/models';

import { TopCountriesCard } from '@/components/screens/links/show/top-countries-card';

export const AnalyticsCountries = ({ clicks }: { clicks: TClick[] }) => {
    return <TopCountriesCard clicks={clicks} />;
};
