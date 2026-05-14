import { createFileRoute } from '@tanstack/react-router';

import Settings from '#/pages/settings';

export const Route = createFileRoute('/dashboard/_auth/settings')({
    component: Settings,
});
