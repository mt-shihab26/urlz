import type { ReactNode } from 'react';

import { FieldError } from '@/components/ui/field';
import { Label } from '@/components/ui/label';

export const FormField = ({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string | null;
    children: ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <FieldError>{error}</FieldError>}
        </div>
    );
};
