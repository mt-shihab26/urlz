import { createFileRoute } from '@tanstack/react-router';

import Clicks from '#/pages/clicks';

export const Route = createFileRoute('/dashboard/_auth/clicks')({
    component: Clicks,
});
