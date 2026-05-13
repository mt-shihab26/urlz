import type { TLink } from '@/types/models';
import type { TFilter } from '@/types/utils';

export const isLinkExpiringSoon = (link: TLink, withinDays = 30) => {
    if (!link.expires) return false;
    const t = new Date(link.expires).getTime();
    const now = Date.now();
    return t > now && t <= now + withinDays * 24 * 60 * 60 * 1000;
};

export const isLinkExpired = (link: TLink) => {
    return !!link.expires && new Date(link.expires) < new Date();
};

export const isLinkActive = (link: TLink) => {
    return link.status === 'active' && !isLinkExpired(link);
};

export const isLinkDisabled = (link: TLink) => {
    return link.status === 'disabled';
};

export const filterLinks = <T extends TLink>({
    links,
    search,
    filter,
}: {
    links: T[];
    search: string;
    filter: TFilter;
}): T[] => {
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
        } else if (filter === 'active') {
            matchFilter = isLinkActive(l);
        } else {
            matchFilter = isLinkDisabled(l);
        }

        return matchSearch && matchFilter;
    });
};

export const generateRandomSlug = () => {
    return Math.random().toString(36).slice(2, 7);
};
