import type { ReactNode } from 'react';

export const PublicGuard = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};
