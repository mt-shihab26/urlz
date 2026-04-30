import { CameraIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarUrl, updateAvatar } from '@/lib/auth';
import type { TUser } from '@/types/models';

export const AvatarUpload = ({ user }: { user: TUser }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(getAvatarUrl(user));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            await updateAvatar(user.id, file);
            setAvatarUrl(URL.createObjectURL(file));
        } catch (e: any) {
            setError(e?.message ?? 'Failed to upload avatar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="group relative w-fit rounded-full"
            >
                <Avatar className="size-20 text-2xl">
                    <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-linear-to-br from-primary to-blue-400 font-bold text-white">
                        {user.name[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <CameraIcon className="size-6 text-white" />
                </div>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
};
