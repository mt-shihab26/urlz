import type { TClick } from '@/types/models';

import { clicksToSeries } from '@/lib/clicks';
import { useMemo } from 'react';

import { Sparkline } from '@/components/composite/sparkline';

export const LinkSparkline = ({ clicks }: { clicks: TClick[] }) => {
    const series = useMemo(() => clicksToSeries(clicks).slice(-14), [clicks]);
    return <Sparkline data={series} width={64} height={22} />;
};
