import type { ComponentProps } from 'react';

import { FormField } from '@/components/composite/form-field';
import { Input } from '@/components/ui/input';

export const TextField = ({
    id,
    label,
    error,
    ...props
}: {
    id: string;
    label: string;
    error?: string | null;
} & Omit<ComponentProps<'input'>, 'id' | 'type'>) => (
    <FormField id={id} label={label} error={error}>
        <Input id={id} type="text" {...props} />
    </FormField>
);
