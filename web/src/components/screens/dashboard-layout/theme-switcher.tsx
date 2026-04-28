import { useTheme } from '@/components/providers/theme-provider';
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

function ThemeIcon({ theme }: { theme: 'dark' | 'light' | 'system' }) {
    if (theme === 'dark') {
        return <MoonIcon />;
    }

    if (theme === 'light') {
        return <SunIcon />;
    }

    return <MonitorIcon />;
}

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <ThemeIcon theme={theme} />
                Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="system">
                        <MonitorIcon />
                        System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <MoonIcon />
                        Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                        <SunIcon />
                        Light
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
