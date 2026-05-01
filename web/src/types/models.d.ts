export type TUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    deleted?: string;
};

export type TLinkStatus = 'active' | 'disabled' | 'expired';

export type TSerie = {
    date: string;
    clicks: number;
};

export type TLinkCountry = {
    country: string;
    code: string;
    clicks: number;
    pct: number;
};

export type TLinkReferrer = {
    source: string;
    clicks: number;
};

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
    series: TSerie[];
    countries: TLinkCountry[];
    referrers: TLinkReferrer[];
};
