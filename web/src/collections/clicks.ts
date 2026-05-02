import type { TRange } from '@/lib/ranges';
import type { TClick } from '@/types/models';

import { pb } from '@/lib/pb';
import { getRangeStartDate } from '@/lib/ranges';

const CLICKS = 'clicks';

/**
 * Fetches all clicks for the authenticated user.
 *
 * @throws {Error} When fetching clicks fails.
 */
const getClicks = async (range: TRange = 'All'): Promise<TClick[]> => {
    try {
        const startDate = getRangeStartDate(range);

        return await pb.collection(CLICKS).getFullList<TClick>({
            filter: startDate ? pb.filter('date >= {:startDate}', { startDate }) : undefined,
            sort: '-created',
        });
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch clicks');
    }
};

/**
 * Subscribes to real-time updates from the `clicks` collection.
 */
export const subscribeClicks = (
    range: TRange,
    {
        onData,
        onError,
        onLoading,
    }: {
        onData: (clicks: TClick[]) => void;
        onError?: (error: string) => void;
        onLoading?: (loading: boolean) => void;
    },
) => {
    try {
        (async () => {
            onLoading?.(true);
            try {
                onData(await getClicks(range));
            } catch (e: any) {
                onError?.(e.message);
            } finally {
                onLoading?.(false);
            }
        })();

        pb.collection(CLICKS).subscribe('*', async () => {
            try {
                onData(await getClicks(range));
            } catch (e: any) {
                onError?.(e.message);
            }
        });
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to subscribe to clicks');
    }
};

/**
 * Unsubscribes from all real-time updates on the `clicks` collection.
 */
export const unsubscribeClicks = ({ onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection(CLICKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from clicks');
    }
};

/**
 * Fetches all clicks for a specific link.
 *
 * @throws {Error} When fetching clicks fails.
 */
const getClicksByLink = async (linkId: string): Promise<TClick[]> => {
    try {
        return await pb.collection(CLICKS).getFullList<TClick>({
            filter: pb.filter('link = {:linkId}', { linkId }),
            sort: '-created',
        });
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to fetch clicks');
    }
};

/**
 * Subscribes to real-time updates for clicks belonging to a specific link.
 */
export const subscribeClicksByLink = (
    linkId: string,
    {
        onData,
        onError,
        onLoading,
    }: {
        onData: (clicks: TClick[]) => void;
        onError?: (error: string) => void;
        onLoading?: (loading: boolean) => void;
    },
) => {
    try {
        (async () => {
            onLoading?.(true);
            try {
                onData(await getClicksByLink(linkId));
            } catch (e: any) {
                onError?.(e.message);
            } finally {
                onLoading?.(false);
            }
        })();

        pb.collection(CLICKS).subscribe('*', async (e) => {
            if (e.record['link'] === linkId) {
                try {
                    onData(await getClicksByLink(linkId));
                } catch (err: any) {
                    onError?.(err.message);
                }
            }
        });
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to subscribe to clicks');
    }
};

/**
 * Unsubscribes from real-time updates on the `clicks` collection.
 */
export const unsubscribeClicksByLink = ({ onError }: { onError?: (error: string) => void }) => {
    try {
        pb.collection(CLICKS).unsubscribe('*');
    } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to unsubscribe from clicks');
    }
};
