import type { TLink } from '#/types/models';

import { isLinkExpired } from '#/lib/links';

import { StatusBadge } from './status-badge';

export const LinkStatusBadge = ({ link }: { link: TLink }) => {
    return <StatusBadge status={isLinkExpired(link) ? 'expired' : link.status} />;
};
