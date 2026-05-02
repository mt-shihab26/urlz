import type { TFilter } from '@/components/screens/links/index/filters-toggle';
import type { TLink } from '@/types/models';

export const isLinkExpired = (link: TLink) =>
    !!link.expires && new Date(link.expires) < new Date();

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

        let matchFilter: boolean;
        if (filter === 'all') {
            matchFilter = true;
        } else if (filter === 'expired') {
            matchFilter = isLinkExpired(l);
        } else {
            matchFilter = l.status === filter && !isLinkExpired(l);
        }

        return matchSearch && matchFilter;
    });
};

export const generateRandomSlug = () => {
    return Math.random().toString(36).slice(2, 7);
};
