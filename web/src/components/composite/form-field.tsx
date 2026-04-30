import type { ReactNode } from 'react';

import { FieldError } from '@/components/ui/field';
import { Label } from '@/components/ui/label';

export const FormField = ({
    id,
    label,
    labelExtra,
    error,
    children,
}: {
    id: string;
    label: string;
    labelExtra?: ReactNode;
    error?: string | null;
    children: ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor={id}>{label}</Label>
                {labelExtra}
            </div>
            {children}
            {error && <FieldError>{error}</FieldError>}
        </div>
    );
};
