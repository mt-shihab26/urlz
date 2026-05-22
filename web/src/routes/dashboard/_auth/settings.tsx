import { createFileRoute } from '@tanstack/react-router';

import { Header } from '#/components/composite/site-header';
import { DangerZoneCard } from '#/components/screens/settings/danger-zone-card';
import { ProfileCard } from '#/components/screens/settings/profile-card';
import { ThemeCard } from '#/components/screens/settings/theme-card';
import { head } from '#/lib/utils';

export const Route = createFileRoute('/dashboard/_auth/settings')({
    head: () => head('Settings'),
    component: Settings,
});

function Settings() {
    return (
        <>
            <Header
                title="Settings"
                description="Manage your account, API access, and preferences"
            />
            <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
                <ThemeCard />
                <ProfileCard />
                <DangerZoneCard />
            </div>
        </>
    );
}
