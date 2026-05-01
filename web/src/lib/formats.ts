export const formatCode = (code: string) => {
    return `http://localhost:8090/${code}`;
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
