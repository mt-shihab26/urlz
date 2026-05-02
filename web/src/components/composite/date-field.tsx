import type { ComponentProps } from 'react';

import { FormField } from '@/components/composite/form-field';
import { Input } from '@/components/ui/input';

const normalizeDateValue = (value: ComponentProps<'input'>['value']) => {
    if (typeof value !== 'string') return value;
    return value.includes('T') ? value.split('T')[0] : value;
};

export const DateField = ({
    id,
    label,
    error,
    value,
    ...props
}: {
    id: string;
    label: string;
    error?: string | null;
} & Omit<ComponentProps<'input'>, 'id' | 'type'>) => {
    return (
        <FormField id={id} label={label} error={error}>
            <Input id={id} type="date" value={normalizeDateValue(value)} {...props} />
        </FormField>
    );
};
