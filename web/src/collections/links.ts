import type { TClick, TLink, TLinkStatus } from '@/types/models';

import { pb } from '@/lib/pb';

const LINKS = 'links';
const CLICKS = 'clicks';
const EXPAND = 'clicks_via_link';

const mapClicks = (raw: any): TLink => ({
    ...raw,
    clicks: (raw.expand?.[EXPAND] as TClick[] | undefined) ?? [],
});

/**
 * Fetches all links sorted by newest first.
 *
 * @throws {Error} When fetching links fails.
 */
const getLinks = async (): Promise<TLink[]> => {
    try {
        const records = await pb
            .collection(LINKS)
            .getFullList({ sort: '-created', expand: EXPAND });
        return records.map(mapClicks);
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
    const refresh = async () => {
        try {
            onData(await getLinks());
        } catch (e: any) {
            onError?.(e.message);
        }
    };

    try {
        (async () => {
            onLoading?.(true);
            await refresh();
            onLoading?.(false);
        })();

        pb.collection(LINKS).subscribe('*', refresh);
        pb.collection(CLICKS).subscribe('*', refresh);
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
        pb.collection(CLICKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from links');
    }
};

/**
 * Fetches a single link by its ID.
 *
 * @throws {Error} When the link is not found or the request fails.
 */
const getLinkById = async (id: string): Promise<TLink> => {
    try {
        const record = await pb.collection(LINKS).getOne(id, { expand: EXPAND });
        return mapClicks(record);
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch link');
    }
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
        onData: (link: TLink) => void;
        onError?: (error: string) => void;
        onLoading?: (loading: boolean) => void;
    },
) => {
    const refresh = async () => {
        try {
            onData(await getLinkById(id));
        } catch (e: any) {
            onError?.(e.message);
        }
    };

    try {
        (async () => {
            onLoading?.(true);
            await refresh();
            onLoading?.(false);
        })();

        pb.collection(LINKS).subscribe(id, refresh);
        pb.collection(CLICKS).subscribe('*', async (e) => {
            if (e.record['link'] === id) await refresh();
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
        pb.collection(CLICKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from link');
    }
};

/**
 * Creates a new link record in the `links` collection with default metadata (user, status).
 */
export const createLink = async (data: {
    url: string;
    title: string;
    code: string;
    expires?: string;
}): Promise<TLink> => {
    const record = await pb.collection(LINKS).create({
        ...data,
        user: pb.authStore.record!.id,
        status: 'active',
    });
    return mapClicks(record);
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
