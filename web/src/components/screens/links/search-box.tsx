import { Input } from '@/components/ui/input';

export const SearchBox = ({
    search,
    onSearch,
}: {
    search: string;
    onSearch: (search: string) => void;
}) => {
    return (
        <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search links..."
            className="max-w-xs"
        />
    );
};
