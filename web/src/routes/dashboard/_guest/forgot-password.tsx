import { createFileRoute } from '@tanstack/react-router';

import ForgotPassword from '#/pages/forgot-password';

export const Route = createFileRoute('/dashboard/_guest/forgot-password')({
    component: ForgotPassword,
});
