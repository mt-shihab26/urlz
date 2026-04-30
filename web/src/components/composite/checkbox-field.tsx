import type { ReactNode } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const CheckboxField = ({
    id,
    checked,
    onCheckedChange,
    children,
}: {
    id: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    children: ReactNode;
}) => (
    <div className="flex items-start gap-2">
        <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(v) => onCheckedChange(!!v)}
            className="mt-0.5"
        />
        <Label
            htmlFor={id}
            className="cursor-pointer text-sm font-normal leading-relaxed flex flex-wrap items-center gap-1"
        >
            {children}
        </Label>
    </div>
);
