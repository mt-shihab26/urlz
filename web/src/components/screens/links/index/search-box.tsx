import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

export const SearchBox = ({
    search,
    onSearch,
}: {
    search: string;
    onSearch: (search: string) => void;
}) => {
    const [value, setValue] = useState(search);

    const debouncedSearch = useDebounceCallback(onSearch, 200);

    useEffect(() => setValue(search), [search]);

    return (
        <Input
            value={value}
            onChange={(e) => {
                const value = e.target.value;
                setValue(value); // immediate UI update
                debouncedSearch(value); // delayed callback
            }}
            placeholder="Search links..."
            className="max-w-xs"
        />
    );
};
