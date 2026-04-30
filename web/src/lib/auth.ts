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
    window.location.reload();
};

export const updateProfile = async (userId: string, name: string, email: string) => {
    await pb.collection('users').update(userId, { name, email });
    await pb.collection('users').authRefresh();
};

export const updateAvatar = async (userId: string, file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    await pb.collection('users').update(userId, form);
    await pb.collection('users').authRefresh();
};

export const deleteAccount = async (userId: string) => {
    await pb.collection('users').update(userId, { deleted: true });
    pb.authStore.clear();
};

export const getAvatarUrl = (user: TUser): string | null => {
    if (!user.avatar) return null;
    return pb.files.getURL(user, user.avatar);
};
