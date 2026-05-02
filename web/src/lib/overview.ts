export const RANGES = ['7d', '30d', '90d', 'All'] as const;

export type TRange = (typeof RANGES)[number];
