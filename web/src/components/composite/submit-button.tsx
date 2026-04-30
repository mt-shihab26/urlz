import { Button } from '@/components/ui/button';

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
            {label}
        </Button>
    );
};
