import type { TLink, TLinkStatus } from '#/types/models';

import { pb } from '#/lib/pb';

const LINKS = 'links';

/**
 * Creates a new link record in the `links` collection with default metadata (user, status).
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
