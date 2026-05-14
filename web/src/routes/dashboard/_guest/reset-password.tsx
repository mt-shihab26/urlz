import { createFileRoute } from '@tanstack/react-router';

import ResetPassword from '#/pages/reset-password';

export const Route = createFileRoute('/dashboard/_guest/reset-password')({
    component: ResetPassword,
});
