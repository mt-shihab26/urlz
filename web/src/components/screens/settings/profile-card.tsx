import { getAuth, getAvatarUrl, updateAvatar } from '@/lib/auth';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CameraIcon } from 'lucide-react';

export const ProfileCard = () => {
    const user = getAuth();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(user ? getAvatarUrl(user) : null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setAvatarLoading(true);
        try {
            await updateAvatar(user.id, file);
            setAvatarUrl(URL.createObjectURL(file));
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarLoading}
                        className="group relative size-14 shrink-0 rounded-full"
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="size-14 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-primary to-blue-400 text-xl font-bold text-white">
                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <CameraIcon className="size-5 text-white" />
                        </div>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <div>
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue={user?.name} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={user?.email} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button size="sm">Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
};
