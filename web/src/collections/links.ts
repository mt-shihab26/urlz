import type { TLink, TLinkStatus } from '@/types/models';

import { pb } from '@/lib/pb';

export const getLinks = async (): Promise<TLink[]> => {
    return pb.collection('links').getFullList<TLink>({ sort: '-created' });
};

export const getLinkById = async (id: string): Promise<TLink> => {
    return pb.collection('links').getOne<TLink>(id);
};

export const createLink = async (data: {
    url: string;
    title: string;
    code: string;
    expires?: string;
}): Promise<TLink> => {
    return pb.collection('links').create<TLink>({
        ...data,
        user: pb.authStore.record!.id,
        clicks: 0,
        status: 'active',
        series: [],
    });
};

export const toggleLinkStatus = async (id: string, current: TLinkStatus): Promise<TLink> => {
    const status = current === 'active' ? 'disabled' : 'active';
    return pb.collection('links').update<TLink>(id, { status });
};

export const deleteLink = async (id: string): Promise<void> => {
    await pb.collection('links').delete(id);
};
