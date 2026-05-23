import { signInWithGoogle } from '#/collections/users';
import { toastError } from '#/lib/toast';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { GoogleIcon } from '#/components/icons/google-icon';
import { Button } from '#/components/ui/button';

export const GoogleOAuthButton = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        setLoading(true);
        signInWithGoogle()
            .then(() => navigate({ to: '/dashboard/overview' }))
            .catch(toastError)
            .finally(() => setLoading(false));
    };

    return (
        <Button
            variant="outline"
            type="button"
            className="w-full gap-2"
            disabled={loading}
            onClick={handleClick}
        >
            <GoogleIcon className="size-5" />
            Continue with Google
        </Button>
    );
};
