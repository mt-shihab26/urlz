import { createFileRoute } from '@tanstack/react-router';

import Analytics from '#/pages/analytics';

export const Route = createFileRoute('/dashboard/_auth/analytics')({
    component: Analytics,
});
