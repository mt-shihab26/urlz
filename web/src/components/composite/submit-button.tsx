import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export const SubmitButton = ({
    loading,
    disabled,
    label,
}: {
    loading: boolean;
    disabled?: boolean;
    label: string;
}) => {
    return (
        <Button type="submit" className="w-full" disabled={loading || disabled}>
            {loading && <Spinner className="mr-2" />}
            {label}
        </Button>
    );
};
