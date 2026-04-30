import type { TUser } from '@/types/models';

import { pb } from './pb';

export const getAuth = (): TUser | null => {
    if (!pb.authStore.isValid) return null;

    return pb.authStore.record as unknown as TUser;
};
