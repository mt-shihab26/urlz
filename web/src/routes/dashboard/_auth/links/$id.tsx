import { createFileRoute } from '@tanstack/react-router';

import LinkDetail from '#/pages/links/show';

export const Route = createFileRoute('/dashboard/_auth/links/$id')({
    component: LinkDetail,
});
