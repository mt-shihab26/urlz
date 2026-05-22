import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '#/components/ui/sidebar';

import githubIconBlack from '#/assets/github-icon-black.svg';
import githubIconWhite from '#/assets/github-icon-white.svg';

export const NavGithub = () => (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton
                render={
                    <a
                        href="https://github.com/mt-shihab26/urlz"
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                }
            >
                <img src={githubIconBlack} className="size-5 dark:hidden" alt="" />
                <img src={githubIconWhite} className="size-5 hidden dark:block" alt="" />
                <span className="group-data-[collapsible=icon]:hidden">GitHub</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
);
