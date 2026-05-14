import { CreateLinkDialog } from '#/components/screens/links/create-link-dialog';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '#/components/ui/sidebar';
import { Link, useLocation } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import * as React from 'react';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: React.ReactNode;
    }[];
}) {
    const location = useLocation();
    const [createOpen, setCreateOpen] = React.useState(false);

    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent className="flex flex-col gap-2">
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center gap-2">
                            <SidebarMenuButton
                                tooltip="New Link"
                                className="min-w-8 bg-primary justify-center text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground group-data-[collapsible=icon]:gap-0"
                                onClick={() => setCreateOpen(true)}
                            >
                                <PlusIcon />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    New Link
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu>
                        {items.map((item) => {
                            const isActive = location.pathname.startsWith(item.url);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isActive}
                                        render={<Link to={item.url} />}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <CreateLinkDialog open={createOpen} onOpenChange={setCreateOpen} />
        </>
    );
}
