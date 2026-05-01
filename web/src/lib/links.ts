import type { TFilter } from '@/components/screens/links/filters-toggle';
import type { TLink } from '@/types/models';

export const filterLinks = ({
    links,
    search,
    filter,
}: {
    links: TLink[];
    search: string;
    filter: TFilter;
}) => {
    return links.filter((l) => {
        const matchSearch =
            !search ||
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.code.includes(search) ||
            l.url.includes(search);
        const matchFilter = filter === 'all' || l.status === filter;
        return matchSearch && matchFilter;
    });
};
