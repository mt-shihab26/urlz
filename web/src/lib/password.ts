export const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500 dark:bg-green-400', width: '100%' };
};
