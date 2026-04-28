import * as React from 'react';
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Header } from '@/components/composite/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTheme } from '@/components/providers/theme-provider';
import { API_KEYS_DATA } from '@/lib/urlz-data';
import { cn } from '@/lib/utils';

type ApiKeyStatus = 'active' | 'revoked';
interface ApiKey {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    status: ApiKeyStatus;
}

const maskKey = (key: string) => key.slice(0, 18) + '●'.repeat(12) + key.slice(-4);

function Settings() {
    const { theme, setTheme } = useTheme();
    const [keys, setKeys] = React.useState<ApiKey[]>(API_KEYS_DATA);
    const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});
    const [copied, setCopied] = React.useState<string | null>(null);

    const revokeKey = (id: string) =>
        setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));

    const copyKey = (id: string) => {
        setCopied(id);
        setTimeout(() => setCopied(null), 1800);
    };

    const themeOptions: { value: 'light' | 'system' | 'dark'; label: string; icon: React.ReactNode }[] = [
        { value: 'light', label: 'Light', icon: <SunIcon className="size-4" /> },
        { value: 'system', label: 'System', icon: <MonitorIcon className="size-4" /> },
        { value: 'dark', label: 'Dark', icon: <MoonIcon className="size-4" /> },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Settings"
                description="Manage your account, API access, and preferences"
            />

            <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                            Theme
                        </Label>
                        <div className="flex rounded-lg border bg-muted p-1 gap-1 max-w-xs">
                            {themeOptions.map(({ value, label, icon }) => (
                                <button
                                    key={value}
                                    onClick={() => setTheme(value)}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
                                        theme === value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {icon}
                                    {label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {theme === 'system'
                                ? 'Follows your OS preference automatically.'
                                : theme === 'dark'
                                  ? 'Always use the dark theme.'
                                  : 'Always use the light theme.'}
                        </p>
                    </CardContent>
                </Card>

                {/* Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-xl font-bold text-white">
                                J
                            </div>
                            <div>
                                <div className="font-semibold">Jamie Chen</div>
                                <div className="text-sm text-muted-foreground">
                                    jamie@myapp.com
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Display Name', value: 'Jamie Chen', id: 'name' },
                                { label: 'Email', value: 'jamie@myapp.com', id: 'email' },
                            ].map(({ label, value, id }) => (
                                <div key={id} className="flex flex-col gap-1.5">
                                    <Label htmlFor={id}>{label}</Label>
                                    <Input id={id} defaultValue={value} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button size="sm">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
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
                            <div
                                key={k.id}
                                className={cn(
                                    'px-6 py-4',
                                    i < keys.length - 1 && 'border-b',
                                )}
                            >
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
                                            onClick={() =>
                                                setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))
                                            }
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
                                                copied === k.id &&
                                                    'text-green-600 dark:text-green-400',
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
                                        k.status === 'revoked' &&
                                            'text-muted-foreground line-through',
                                    )}
                                >
                                    {revealed[k.id] ? k.key : maskKey(k.key)}
                                </code>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/40">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently remove all links, data, and your account.
                                </p>
                            </div>
                            <Button variant="destructive" size="sm">
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
export default Settings;
