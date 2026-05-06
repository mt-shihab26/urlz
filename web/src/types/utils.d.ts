import type { TLinkStatus } from './models';

export type TFilter = 'all' | TLinkStatus | 'expired';

export type TBreakdownItem = { label: string; count: number };
