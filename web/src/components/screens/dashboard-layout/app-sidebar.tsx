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
    CommandIcon,
    LayoutDashboardIcon,
    LinkIcon,
    PanelLeftIcon,
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
    const { toggleSidebar } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
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
