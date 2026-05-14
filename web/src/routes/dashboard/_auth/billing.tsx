import { createFileRoute } from '@tanstack/react-router';

import Billing from '#/pages/billing';

export const Route = createFileRoute('/dashboard/_auth/billing')({
    component: Billing,
});
