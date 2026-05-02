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
