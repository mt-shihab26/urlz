import { codePrefix } from './utils';

export const formatCode = (code: string) => {
    return `${codePrefix()}/${code}`;
};

export const formatNumber = (valueNumber: number) => {
    return valueNumber.toLocaleString();
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatChartDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

export const formatLocaleDate = (ts: number) => {
    return ts ? new Date(ts * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';
};

export const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(cents / 100);
};
