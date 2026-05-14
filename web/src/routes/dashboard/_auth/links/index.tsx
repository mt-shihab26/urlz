import { createFileRoute } from '@tanstack/react-router';

import Links from '#/pages/links/index';

export const Route = createFileRoute('/dashboard/_auth/links/')({
    component: Links,
});
