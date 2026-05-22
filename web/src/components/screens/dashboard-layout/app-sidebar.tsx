import {
    ChartBarIcon,
    CreditCardIcon,
    LayoutDashboardIcon,
    LinkIcon,
    MousePointerClickIcon,
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
} from '#/components/ui/sidebar';

import logo from '#/assets/logo.svg';

import type { TNavItem } from '#/types/utils';
import type { ComponentProps } from 'react';

import { useUser } from '#/components/providers/auth-provider';
import { useSidebar } from '#/components/ui/sidebar';

import { Link } from '@tanstack/react-router';
import { NavGithub } from './nav-github';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const navMain: TNavItem[] = [
    {
        title: 'Overview',
        url: '/dashboard/overview',
        icon: <LayoutDashboardIcon />,
    },
    {
        title: 'Analytics',
        url: '/dashboard/analytics',
        icon: <ChartBarIcon />,
    },
    {
        title: 'Links',
        url: '/dashboard/links',
        icon: <LinkIcon />,
    },
    {
        title: 'Clicks',
        url: '/dashboard/clicks',
        icon: <MousePointerClickIcon />,
    },
    {
        title: 'Billing',
        url: '/dashboard/billing',
        icon: <CreditCardIcon />,
    },
    {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: <SettingsIcon />,
    },
];

export const AppSidebar = (props: ComponentProps<typeof Sidebar>) => {
    const { toggleSidebar } = useSidebar();
    const { user } = useUser();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                            render={<Link to="/dashboard/overview" />}
                        >
                            <img src={logo} alt="urlz" className="size-5! shrink-0" />
                            <span className="text-base font-semibold">urlz</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter className="gap-2">
                <NavUser user={user} />
                <NavGithub />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
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
