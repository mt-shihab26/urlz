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
        return await pb.collection(LINKS).getFullList<TLink>({ sort: '-created' });
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch links');
    }
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
            onLoading?.(true);
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError?.(e.message);
            } finally {
                onLoading?.(false);
            }
        })();

        pb.collection(LINKS).subscribe('*', async () => {
            try {
                onData(await getLinks());
            } catch (e: any) {
                onError?.(e.message);
            }
        });
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to subscribe to links');
    }
};

/**
 * Unsubscribes from all real-time updates on the `links` collection.
 */
export const unsubscribeLinks = ({ onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection(LINKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from links');
    }
};

const getLinkById = async (id: string): Promise<TLink> => {
    return pb.collection(LINKS).getOne<TLink>(id);
};

/**
 * Subscribes to real-time updates for a single link by ID.
 */
export const subscribeLink = (
    id: string,
    {
        onData,
        onError,
        onLoading,
    }: {
        onData: (links: TLink) => void;
        onError?: (error: string) => void;
        onLoading?: (loading: boolean) => void;
    },
) => {
    try {
        (async () => {
            onLoading?.(true);
            try {
                onData(await getLinkById(id));
            } catch (e: any) {
                onError?.(e.message);
            } finally {
                onLoading?.(false);
            }
        })();

        pb.collection(LINKS).subscribe(id, async (e) => {
            try {
                onData(e.record as unknown as TLink);
            } catch (e: any) {
                onError?.(e.message);
            }
        });
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to subscribe to link');
    }
};

/**
 * Unsubscribes from real-time updates for a single link by ID.
 */
export const unsubscribeLink = (id: string, { onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection(LINKS).unsubscribe(id);
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from link');
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
        clicks: [],
        status: 'active',
    });
};

/**
 * Updates editable fields of a link record.
 */
export const updateLink = async (
    id: string,
    data: { url: string; title: string; code: string; expires?: string },
): Promise<TLink> => {
    return pb.collection(LINKS).update<TLink>(id, data);
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
