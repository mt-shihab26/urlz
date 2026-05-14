import { createFileRoute } from '@tanstack/react-router';

import Overview from '#/pages/overview';

export const Route = createFileRoute('/dashboard/_auth/overview')({
    component: Overview,
});
