import type { TUser } from '@/types/models';

import { pb } from '@/lib/pb';

export const signUp = async (name: string, email: string, password: string) => {
    await pb.collection('users').create({ name, email, password, passwordConfirm: password });
    await pb.collection('users').authWithPassword(email, password);
};

export const signIn = async (email: string, password: string) => {
    await pb.collection('users').authWithPassword(email, password);
};

const refresh = async () => {
    await pb.collection('users').authRefresh();
};

export const signOut = () => {
    pb.authStore.clear();
    window.location.reload();
};

export const getAuth = (): TUser | null => {
    if (!pb.authStore.isValid) return null;
    return pb.authStore.record as unknown as TUser;
};

export const getAvatarUrl = (user: TUser): string | null => {
    if (!user.avatar) return null;
    return pb.files.getURL(user, user.avatar);
};

export const updateProfile = async (userId: string, name: string, email: string) => {
    await pb.collection('users').update(userId, { name, email });
    await refresh();
};

export const updateAvatar = async (userId: string, file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    await pb.collection('users').update(userId, form);
    await refresh();
};

export const deleteAccount = async (userId: string) => {
    await pb.collection('users').update(userId, { deleted: true });
    signOut();
};
