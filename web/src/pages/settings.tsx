import { Header } from '@/components/composite/site-header';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ApiKeysCard } from '@/components/screens/settings/api-keys-card';
import { DangerZoneCard } from '@/components/screens/settings/danger-zone-card';
import { ProfileCard } from '@/components/screens/settings/profile-card';

const Settings = () => (
    <DashboardLayout title="Settings">
        <Header
            title="Settings"
            description="Manage your account, API access, and preferences"
        />
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
            <ProfileCard />
            <ApiKeysCard />
            <DangerZoneCard />
        </div>
    </DashboardLayout>
);

export default Settings;
