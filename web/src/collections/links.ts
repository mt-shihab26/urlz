import type { TLink, TLinkStatus } from '@/types/models';

import { pb } from '@/lib/pb';

const LINKS = 'links';

/**
 * Fetches all links sorted by newest first.
 *
 * @throws {Error} When fetching links fails.
 */
const getLinks = async (): Promise<TLink[]> => {
    try {
        return pb.collection(LINKS).getFullList<TLink>({ sort: '-created' });
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch links');
    }
};

export const getLinkById = async (id: string): Promise<TLink> => {
    return pb.collection(LINKS).getOne<TLink>(id);
};

/**
 * Subscribes to real-time updates from the `links` collection.
 */
export const subscribeLinks = ({
    onData,
    onError,
    onLoading,
}: {
    onData: (links: TLink[]) => void;
    onError?: (error: string) => void;
    onLoading?: (loading: boolean) => void;
}) => {
    try {
        (async () => {
            onLoading && onLoading(true);
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError && onError(e.message);
            } finally {
                onLoading && onLoading(false);
            }
        })();

        pb.collection(LINKS).subscribe('*', async () => {
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError && onError(e.message);
            } finally {
            }
        });
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to subscribe to links collection');
    }
};

/**
 * Unsubscribes from all real-time updates on the `links` collection.
 */
export const unsubscribeLinks = ({ onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection(LINKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe to links collection');
    }
};

/**
 * Creates a new link record in the `links` collection with default metadata (user, clicks, status, series).
 */
export const createLink = async (data: {
    url: string;
    title: string;
    code: string;
    expires?: string;
}): Promise<TLink> => {
    return pb.collection(LINKS).create<TLink>({
        ...data,
        user: pb.authStore.record!.id,
        clicks: 0,
        status: 'active',
        series: [],
    });
};

/**
 * Toggles a link's status between `active` and `disabled` and updates it in the `links` collection.
 */
export const toggleLinkStatus = async (id: string, current: TLinkStatus): Promise<TLink> => {
    const status = current === 'active' ? 'disabled' : 'active';
    return pb.collection(LINKS).update<TLink>(id, { status });
};

/**
 * Deletes a link record from the `links` collection by its ID.
 */
export const deleteLink = async (id: string): Promise<void> => {
    await pb.collection(LINKS).delete(id);
};
