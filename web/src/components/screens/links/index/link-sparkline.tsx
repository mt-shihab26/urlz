import type { TSerie } from '@/types/models';

import { Sparkline } from '@/components/composite/sparkline';

export const LinkSparkline = ({ series }: { series: TSerie[] }) => {
    return <Sparkline data={series.slice(-14)} width={64} height={22} />;
};
