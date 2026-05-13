import type { TClickDay } from '@/services/links';

import { Sparkline } from '@/components/composite/sparkline';

export const LinkSparkline = ({ sparkline }: { sparkline: TClickDay[] }) => {
    return <Sparkline data={sparkline} width={64} height={22} />;
};
