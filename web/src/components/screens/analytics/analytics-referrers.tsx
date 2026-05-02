import type { TClick } from '@/types/models';

import { ReferrersCard } from '@/components/screens/links/show/referrers-card';

export const AnalyticsReferrers = ({ clicks }: { clicks: TClick[] }) => {
    return <ReferrersCard clicks={clicks} />;
};
