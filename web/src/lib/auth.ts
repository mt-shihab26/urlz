import type { TUser } from '@/types/models';

import { pb } from './pb';

export const getAuth = (): TUser | null => {
    if (!pb.authStore.isValid) return null;

    return pb.authStore.record as unknown as TUser;
};

export const signUp = async (name: string, email: string, password: string) => {
    await pb.collection('users').create({ name, email, password, passwordConfirm: password });
    await pb.collection('users').authWithPassword(email, password);
};

export const signIn = async (email: string, password: string) => {
    await pb.collection('users').authWithPassword(email, password);
};

export const signOut = () => {
    pb.authStore.clear();
};
