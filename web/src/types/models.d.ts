export type TUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    deleted?: string;
};

export type TLinkStatus = 'active' | 'disabled';

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
};

export type TClick = {
    id: string;
    user: string;
    link: string;
    date: string;
    country_name: string;
    country_code: string;
    city: string;
    region: string;
    timezone: string;
    referrer: string;
    browser: string;
    os: string;
    device: string;
    ip: string;
    user_agent: string;
    language: string;
    created: string;
    updated: string;
};
