import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

const themes = [
    {
        value: 'system',
        label: 'System',
        description: 'Follow your device appearance.',
        icon: MonitorIcon,
    },
    {
        value: 'dark',
        label: 'Dark',
        description: 'Use the darker interface.',
        icon: MoonIcon,
    },
    {
        value: 'light',
        label: 'Light',
        description: 'Use the brighter interface.',
        icon: SunIcon,
    },
] as const;

export const ThemeCard = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose how the dashboard should look.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
                {themes.map(({ value, label, description, icon: Icon }) => (
                    <Button
                        key={value}
                        variant={theme === value ? 'secondary' : 'outline'}
                        className={cn(
                            'h-auto w-full flex-col items-start justify-start gap-2 px-4 py-4 text-left whitespace-normal normal-case tracking-normal',
                            theme === value && 'border-border',
                        )}
                        onClick={() => setTheme(value)}
                    >
                        <span className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="size-4" />
                            {label}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {description}
                        </span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
};
