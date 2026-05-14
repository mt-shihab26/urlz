import { Button } from '#/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

export const RefreshButton = ({
    onClick,
    isFetching,
    isLoading,
}: {
    onClick: () => void;
    isFetching: boolean;
    isLoading: boolean;
}) => {
    return (
        <Button variant="outline" size="sm" onClick={onClick} disabled={isFetching || isLoading}>
            <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
            Refresh
        </Button>
    );
};
