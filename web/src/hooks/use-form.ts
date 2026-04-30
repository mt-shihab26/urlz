import { useState } from 'react';

export const useForm = <T>(initialData: T) => {
    const [data, setData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
    const [loading, setLoading] = useState(false);

    return {
        data,
        setData: <K extends keyof T>(key: K, value: T[K]) => {
            setData((prev) => ({ ...prev, [key]: value }));
        },
        errors,
        setErrors: (key: keyof T, value: string | null) => {
            setErrors((prev) => ({ ...prev, [key]: value }));
        },
        loading,
        setLoading,
    };
};
