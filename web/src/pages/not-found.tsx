import { Button } from '#/components/ui/button';
import { route } from '#/routes';
import { Link } from '@tanstack/react-router';

const NotFound = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <span className="text-8xl font-bold tracking-tight text-muted-foreground/30">
                    404
                </span>
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    This page doesn't exist or was moved.
                </p>
            </div>
            <Link to={route.overviewIndex()}>
                <Button>Go home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
