import { useState, type ComponentProps, type ReactNode } from 'react';

import { FormField } from '@/components/composite/form-field';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordField = ({
    id,
    label,
    labelExtra,
    error,
    children,
    ...props
}: {
    id: string;
    label: string;
    labelExtra?: ReactNode;
    error?: string | null;
    children?: ReactNode;
} & Omit<ComponentProps<'input'>, 'id' | 'type'>) => {
    const [show, setShow] = useState(false);

    return (
        <FormField id={id} label={label} labelExtra={labelExtra} error={error}>
            <div className="relative">
                <Input id={id} type={show ? 'text' : 'password'} className="pr-9" {...props} />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
            {children}
        </FormField>
    );
};
