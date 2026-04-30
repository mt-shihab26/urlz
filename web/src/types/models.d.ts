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
    user: string;
    code: string;
    url: string;
    title: string;
    clicks: number;
    created: string;
    updated: string;
    status: TLinkStatus;
    expires: string;
    series: { date: string; clicks: number }[];
};
