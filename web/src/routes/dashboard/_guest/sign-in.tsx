import { createFileRoute } from '@tanstack/react-router';

import SignIn from '#/pages/sign-in';

export const Route = createFileRoute('/dashboard/_guest/sign-in')({
    component: SignIn,
});
