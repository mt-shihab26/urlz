import type { ComponentProps } from 'react';

import { FormField } from '@/components/composite/form-field';
import { Input } from '@/components/ui/input';

export const DateField = ({
    id,
    label,
    error,
    ...props
}: {
    id: string;
    label: string;
    error?: string | null;
} & Omit<ComponentProps<'input'>, 'id' | 'type'>) => {
    return (
        <FormField id={id} label={label} error={error}>
            <Input id={id} type="date" {...props} />
        </FormField>
    );
};
