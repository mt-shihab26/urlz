import {
    ChartBarIcon,
    LayoutDashboardIcon,
    LinkIcon,
    PanelLeftIcon,
    SettingsIcon,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { ComponentProps } from 'react';

import { useSidebar } from '@/components/ui/sidebar';
import { getAuth } from '@/lib/auth';

import { Link } from 'react-router';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const navMain = [
    {
        title: 'Overview',
        url: '/overview',
        icon: <LayoutDashboardIcon />,
    },
    {
        title: 'Links',
        url: '/links',
        icon: <LinkIcon />,
    },
    {
        title: 'Analytics',
        url: '/analytics',
        icon: <ChartBarIcon />,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: <SettingsIcon />,
    },
];

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
    const { toggleSidebar } = useSidebar();

    const user = getAuth();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                            render={<Link to="/overview" />}
                        >
                            <LinkIcon className="size-5!" />
                            <span className="text-base font-semibold">urlz</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter className="gap-2">
                <NavUser user={user!} />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                            onClick={toggleSidebar}
                        >
                            <PanelLeftIcon className="size-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Collapse</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};
