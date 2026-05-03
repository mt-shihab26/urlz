import type { TUser } from '@/types/models';
import type { ReactNode } from 'react';

import { getAuth } from '@/collections/users';
import { pb } from '@/lib/pb';
import { createContext, useContext, useEffect, useState } from 'react';

type TAuthContext = {
    user: TUser | null;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<TUser | null>(getAuth);

    useEffect(() => {
        const unsub = pb.authStore.onChange(() => {
            setUser(getAuth());
        });
        return unsub;
    }, []);

    useEffect(() => {
        const id = pb.authStore.record?.id;
        if (!id) return;
        pb.collection('users').subscribe(id, async () => {
            await pb.collection('users').authRefresh();
        });
        return () => {
            pb.collection('users').unsubscribe(id);
        };
    }, [user?.id]);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const useUser = (): { user: TUser } => {
    const { user } = useAuth();
    if (!user) throw new Error('useUser must be used within AuthGuard');
    return { user };
};
