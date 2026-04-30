import { pb } from '@/lib/pb';
import type { TLink, TLinkStatus } from '@/types/models';

type PbLink = Omit<TLink, 'expires' | 'series'> & {
    user: string;
    expires: string;
    series: { date: string; clicks: number }[] | null;
};

const normalize = (r: PbLink): TLink => ({
    id: r.id,
    code: r.code,
    url: r.url,
    title: r.title,
    clicks: r.clicks ?? 0,
    created: r.created,
    status: r.status,
    expires: r.expires || null,
    series: r.series ?? [],
});

export const getLinks = async (): Promise<TLink[]> => {
    const records = await pb.collection('links').getFullList<PbLink>({ sort: '-created' });
    return records.map(normalize);
};

export const getLinkById = async (id: string): Promise<TLink> => {
    const record = await pb.collection('links').getOne<PbLink>(id);
    return normalize(record);
};

export const createLink = async (data: {
    url: string;
    title: string;
    code: string;
    expires?: string;
}): Promise<TLink> => {
    const record = await pb.collection('links').create<PbLink>({
        ...data,
        user: pb.authStore.record!.id,
        clicks: 0,
        status: 'active',
        series: [],
    });
    return normalize(record);
};

export const toggleLinkStatus = async (id: string, current: TLinkStatus): Promise<TLink> => {
    const status = current === 'active' ? 'disabled' : 'active';
    const record = await pb.collection('links').update<PbLink>(id, { status });
    return normalize(record);
};

export const deleteLink = async (id: string): Promise<void> => {
    await pb.collection('links').delete(id);
};
