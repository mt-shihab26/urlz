import type { ComponentProps } from 'react';

import { format, isValid, parseISO } from 'date-fns';

import { FormField } from '#/components/composite/form-field';
import { Input } from '#/components/ui/input';

const normalizeDateValue = (value: ComponentProps<'input'>['value']) => {
    if (typeof value !== 'string') return value;

    const parsed = parseISO(value);
    if (!isValid(parsed)) return value;

    return format(parsed, 'yyyy-MM-dd');
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
