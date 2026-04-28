import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
    ChartBarIcon,
    CommandIcon,
    LayoutDashboardIcon,
    LinkIcon,
    SettingsIcon,
} from 'lucide-react';

import { Link } from 'react-router';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Overview',
            url: '#',
            icon: <LayoutDashboardIcon />,
        },
        {
            title: 'Links',
            url: '#',
            icon: <LinkIcon />,
        },
        {
            title: 'Analytics',
            url: '#',
            icon: <ChartBarIcon />,
        },
        {
            title: 'Settings',
            url: '#',
            icon: <SettingsIcon />,
        },
    ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                            render={<Link to="/dashboard" />}
                        >
                            <CommandIcon className="size-5!" />
                            <span className="text-base font-semibold">URLz</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
