import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';

import type { TUser } from '#/types/models';

import { getAvatarUrl, signOut } from '#/collections/users';
import { useSidebar } from '#/components/ui/sidebar';
import { cn, getInitial } from '#/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '#/components/ui/sidebar';
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react';

const PLAN_LABEL: Record<string, string> = { free: 'Free', pro: 'Pro', business: 'Business' };
const PLAN_CLASS: Record<string, string> = {
    free: 'text-foreground/50',
    pro: 'text-violet-500',
    business: 'text-amber-500',
};

export const NavUser = ({ user }: { user: TUser }) => {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
                    >
                        <Avatar className="size-8 rounded-lg ">
                            <AvatarImage src={getAvatarUrl(user) ?? undefined} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                {getInitial(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs text-foreground/70">
                                {user.email}
                            </span>
                            <span
                                className={cn(
                                    'truncate text-xs font-medium',
                                    PLAN_CLASS[user.plan ?? 'free'],
                                )}
                            >
                                {PLAN_LABEL[user.plan ?? 'free']}
                            </span>
                        </div>
                        <EllipsisVerticalIcon className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-56"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={getAvatarUrl(user) ?? undefined}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {getInitial(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
