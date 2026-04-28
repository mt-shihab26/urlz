import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import {
    ChartBarIcon,
    LinkIcon,
    LayoutDashboardIcon,
    PanelLeftIcon,
    SettingsIcon,
} from 'lucide-react';

import { Link } from 'react-router';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
    user: {
        name: 'Jamie Chen',
        email: 'jamie@myapp.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
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
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { toggleSidebar } = useSidebar();

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
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="gap-2">
                <NavUser user={data.user} />
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
}
