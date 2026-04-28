import type { TUser } from '@/types/models';
import type { ReactNode } from 'react';

import { createContext, useContext, useEffect, useState } from 'react';

type TAuthContext = {
    user: TUser | null;
    loading: boolean;
    setUser: (user: TUser | null) => void;
};

const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<TUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
