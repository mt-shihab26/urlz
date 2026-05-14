import { GoogleIcon } from '#/components/icons/google-icon';
import { Button } from '#/components/ui/button';

export const GoogleOAuthButton = () => {
    return (
        <Button variant="outline" type="button" className="w-full gap-2">
            <GoogleIcon className="size-5" />
            Continue with Google
        </Button>
    );
};
