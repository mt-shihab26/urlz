import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_KEYS_DATA } from '@/lib/urlz-data';
import { cn } from '@/lib/utils';

type ApiKeyStatus = 'active' | 'revoked';

type ApiKey = {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    status: ApiKeyStatus;
};

const maskKey = (key: string) => key.slice(0, 18) + '●'.repeat(12) + key.slice(-4);

export const ApiKeysCard = () => {
    const [keys, setKeys] = useState<ApiKey[]>(API_KEYS_DATA);
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState<string | null>(null);

    const revokeKey = (id: string) =>
        setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));

    const copyKey = (id: string) => {
        setCopied(id);
        setTimeout(() => setCopied(null), 1800);
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>API Keys</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <PlusIcon className="size-3.5" />
                    Generate Key
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {keys.map((k, i) => (
                    <div key={k.id} className={cn('px-6 py-4', i < keys.length - 1 && 'border-b')}>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{k.name}</span>
                                <span
                                    className={cn(
                                        'rounded-full px-2 py-0.5 text-xs font-medium',
                                        k.status === 'active'
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {k.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1 text-xs"
                                    onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}
                                >
                                    {revealed[k.id] ? (
                                        <EyeOffIcon className="size-3" />
                                    ) : (
                                        <EyeIcon className="size-3" />
                                    )}
                                    {revealed[k.id] ? 'Hide' : 'Reveal'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'h-7 gap-1 text-xs',
                                        copied === k.id && 'text-green-600 dark:text-green-400',
                                    )}
                                    onClick={() => copyKey(k.id)}
                                >
                                    {copied === k.id ? (
                                        <CheckIcon className="size-3" />
                                    ) : (
                                        <CopyIcon className="size-3" />
                                    )}
                                    {copied === k.id ? 'Copied' : 'Copy'}
                                </Button>
                                {k.status === 'active' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => revokeKey(k.id)}
                                    >
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        </div>
                        <code
                            className={cn(
                                'block break-all rounded-md bg-muted px-3 py-2 font-mono text-xs',
                                k.status === 'revoked' && 'text-muted-foreground line-through',
                            )}
                        >
                            {revealed[k.id] ? k.key : maskKey(k.key)}
                        </code>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
