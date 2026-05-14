import { createFileRoute } from '@tanstack/react-router';

import SignUp from '#/pages/sign-up';

export const Route = createFileRoute('/dashboard/_guest/sign-up')({
    component: SignUp,
});
