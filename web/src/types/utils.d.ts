import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { TLinkStatus } from './models';

type TNavItem = {
    title: string;
    url: LinkProps['to'];
    icon: ReactNode;
};

export type TFilter = 'all' | TLinkStatus | 'expired';

export type TBreakdownItem = { label: string; count: number };
