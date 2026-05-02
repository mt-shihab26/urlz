export type TUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    deleted?: string;
};

export type TLinkStatus = 'active' | 'disabled';

export type TClick = {
    date: string;
    country_name: string;
    country_code: string;
    referrer: string;
    browser: string;
    os: string;
};

export type TLink = {
    id: string;
    user: string;
    code: string;
    url: string;
    title: string;
    created: string;
    updated: string;
    status: TLinkStatus;
    expires: string;
    clicks: TClick[];
};
