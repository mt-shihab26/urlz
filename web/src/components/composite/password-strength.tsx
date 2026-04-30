const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500 dark:bg-green-400', width: '100%' };
};

export const PasswordStrength = ({ password }: { password: string }) => {
    const strength = getPasswordStrength(password);

    if (!strength) return null;

    return (
        <div className="flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full transition-all ${strength.color}`}
                    style={{ width: strength.width }}
                />
            </div>
            <span className="text-xs text-muted-foreground">{strength.label}</span>
        </div>
    );
};
