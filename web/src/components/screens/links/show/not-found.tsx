import { useNavigate } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p className="text-muted-foreground">This link doesn't exist or was deleted.</p>
            <Button variant="outline" onClick={() => navigate({ to: '/dashboard/links' })}>
                Back to Links
            </Button>
        </div>
    );
}
