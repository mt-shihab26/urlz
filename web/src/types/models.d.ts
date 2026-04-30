export type TUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    deleted?: string;
};

export type TLinkStatus = 'active' | 'disabled' | 'expired';

export type TLink = {
    id: string;
    code: string;
    url: string;
    title: string;
    clicks: number;
    created: string;
    status: TLinkStatus;
    expires: string | null;
    series: { date: string; clicks: number }[];
};
