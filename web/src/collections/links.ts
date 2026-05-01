import type { TLink, TLinkStatus } from '@/types/models';

import { pb } from '@/lib/pb';

/**
 * Fetches all links sorted by newest first.
 *
 * @throws {Error} When fetching links fails.
 */
const getLinks = async (): Promise<TLink[]> => {
    try {
        return pb.collection('links').getFullList<TLink>({ sort: '-created' });
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch links');
    }
};

/**
 * Subscribes to link collection changes and emits updated data.
 */
export const subscribeLinks = ({
    onData,
    onError,
}: {
    onData: (links: TLink[]) => void;
    onError?: (error: string) => void;
}) => {
    try {
        (async () => {
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError && onError(e.message);
            }
        })();

        pb.collection('links').subscribe('*', async () => {
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError && onError(e.message);
            }
        });
    } catch (e) {
        onError &&
            onError(e instanceof Error ? e.message : 'Failed to subscribe to links collection');
    }
};

export const unsubscribeLinks = ({ onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection('links').unsubscribe('*');
    } catch (e) {
        onError &&
            onError(e instanceof Error ? e.message : 'Failed to unsubscribe to links collection');
    }
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
