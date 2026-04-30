import type { TLink } from '@/types/models';

const hash = (n: number) => {
    const x = Math.sin(n + 1) * 10000;
    return x - Math.floor(x);
};

const makeDate = (daysAgo: number): string => {
    const d = new Date('2026-04-27');
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

const DATES_30 = Array.from({ length: 30 }, (_, i) => makeDate(29 - i));

function makeSeries(seed: number) {
    return DATES_30.map((date, i) => {
        const d = new Date(date);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const base = isWeekend ? 40 : 120;
        const trend = 1 + i * 0.008;
        return { date, clicks: Math.max(2, Math.round((base + hash(i * seed) * 140) * trend)) };
    });
}

export const TOTAL_SERIES = DATES_30.map((date, i) => {
    const d = new Date(date);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 180 : 420;
    return { date, clicks: Math.max(10, Math.round(base + hash(i * 3.7) * 280 + i * 8)) };
});

export const LINKS_DATA: TLink[] = [
    {
        id: '1',
        code: 'gh-repo',
        url: 'https://github.com/user/urlz',
        title: 'GitHub Repo',
        clicks: 3842,
        created: makeDate(102),
        status: 'active',
        expires: null,
        series: makeSeries(1.3),
    },
    {
        id: '2',
        code: 'prod',
        url: 'https://myapp.com/pricing',
        title: 'Pricing Page',
        clicks: 1205,
        created: makeDate(83),
        status: 'active',
        expires: makeDate(-60),
        series: makeSeries(2.1),
    },
    {
        id: '3',
        code: 'tweet',
        url: 'https://twitter.com/user/status/1884902341',
        title: 'Launch Tweet',
        clicks: 892,
        created: makeDate(76),
        status: 'active',
        expires: null,
        series: makeSeries(3.5),
    },
    {
        id: '4',
        code: 'docs',
        url: 'https://docs.myapp.com/getting-started',
        title: 'Getting Started',
        clicks: 654,
        created: makeDate(68),
        status: 'active',
        expires: null,
        series: makeSeries(4.2),
    },
    {
        id: '5',
        code: 'lnd',
        url: 'https://myapp.com/landing',
        title: 'Landing Page',
        clicks: 421,
        created: makeDate(56),
        status: 'disabled',
        expires: null,
        series: makeSeries(5.8),
    },
    {
        id: '6',
        code: 'yt-demo',
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Demo Video',
        clicks: 389,
        created: makeDate(52),
        status: 'active',
        expires: null,
        series: makeSeries(6.4),
    },
    {
        id: '7',
        code: 'blog-1',
        url: 'https://blog.myapp.com/introducing-urlz',
        title: 'Launch Blog Post',
        clicks: 276,
        created: makeDate(45),
        status: 'active',
        expires: null,
        series: makeSeries(7.1),
    },
    {
        id: '8',
        code: 'api',
        url: 'https://api.myapp.com/v1/docs',
        title: 'API Reference',
        clicks: 134,
        created: makeDate(37),
        status: 'expired',
        expires: makeDate(2),
        series: makeSeries(8.9),
    },
    {
        id: '9',
        code: 'hn-post',
        url: 'https://news.ycombinator.com/item?id=39823015',
        title: 'HN Discussion',
        clicks: 98,
        created: makeDate(21),
        status: 'active',
        expires: null,
        series: makeSeries(9.3),
    },
    {
        id: '10',
        code: 'invite',
        url: 'https://myapp.com/invite?ref=beta',
        title: 'Beta Invite',
        clicks: 71,
        created: makeDate(14),
        status: 'active',
        expires: makeDate(-7),
        series: makeSeries(2.7),
    },
];

export const COUNTRIES_DATA = [
    { country: 'United States', code: 'US', clicks: 2840, pct: 35.2 },
    { country: 'United Kingdom', code: 'GB', clicks: 1124, pct: 13.9 },
    { country: 'Germany', code: 'DE', clicks: 892, pct: 11.1 },
    { country: 'Canada', code: 'CA', clicks: 654, pct: 8.1 },
    { country: 'France', code: 'FR', clicks: 421, pct: 5.2 },
    { country: 'India', code: 'IN', clicks: 389, pct: 4.8 },
    { country: 'Brazil', code: 'BR', clicks: 312, pct: 3.9 },
    { country: 'Australia', code: 'AU', clicks: 276, pct: 3.4 },
    { country: 'Japan', code: 'JP', clicks: 198, pct: 2.5 },
    { country: 'Other', code: '--', clicks: 946, pct: 11.7 },
];

export const BROWSERS_DATA = [
    { name: 'Chrome', pct: 62.4, color: 'var(--chart-1)' },
    { name: 'Safari', pct: 18.7, color: 'var(--chart-2)' },
    { name: 'Firefox', pct: 9.2, color: 'var(--chart-3)' },
    { name: 'Edge', pct: 6.8, color: 'var(--chart-4)' },
    { name: 'Other', pct: 2.9, color: 'var(--chart-5)' },
];

export const OS_DATA = [
    { name: 'Windows', pct: 41.2, color: 'var(--chart-1)' },
    { name: 'macOS', pct: 28.6, color: 'var(--chart-2)' },
    { name: 'iOS', pct: 15.4, color: 'var(--chart-3)' },
    { name: 'Android', pct: 11.3, color: 'var(--chart-4)' },
    { name: 'Linux', pct: 3.5, color: 'var(--chart-5)' },
];

export const REFERRERS_DATA = [
    { source: 'twitter.com', clicks: 1842, pct: 22.8, change: +18.4 },
    { source: 'google.com', clicks: 1205, pct: 14.9, change: +6.2 },
    { source: 'github.com', clicks: 892, pct: 11.1, change: +31.5 },
    { source: 'Direct', clicks: 780, pct: 9.7, change: -2.1 },
    { source: 'linkedin.com', clicks: 654, pct: 8.1, change: +12.8 },
    { source: 'reddit.com', clicks: 421, pct: 5.2, change: +4.7 },
    { source: 'hackernews.com', clicks: 312, pct: 3.9, change: +88.3 },
    { source: 'Other', clicks: 1946, pct: 24.1, change: -1.3 },
];

export const API_KEYS_DATA = [
    {
        id: 'k1',
        name: 'Production',
        key: 'urlz_live_sk_aBcDeFgHiJkLmNoPqRsTuVwX',
        created: makeDate(90),
        lastUsed: makeDate(0),
        status: 'active' as const,
    },
    {
        id: 'k2',
        name: 'CI / Tests',
        key: 'urlz_live_sk_YzAbCdEfGhIjKlMnOpQrStUv',
        created: makeDate(45),
        lastUsed: makeDate(3),
        status: 'active' as const,
    },
    {
        id: 'k3',
        name: 'Local Dev',
        key: 'urlz_live_sk_WxYzAbCdEfGhIjKlMnOpQrSt',
        created: makeDate(120),
        lastUsed: makeDate(14),
        status: 'revoked' as const,
    },
];
