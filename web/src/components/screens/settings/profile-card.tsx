import { useUser } from '@/components/providers/auth-provider';
import { useForm } from '@/hooks/use-form';
import { getAvatarUrl, updateAvatar, updateProfile } from '@/lib/auth';
import { useRef, useState } from 'react';

import { EmailField } from '@/components/composite/email-field';
import { Form } from '@/components/composite/form';
import { SubmitButton } from '@/components/composite/submit-button';
import { TextField } from '@/components/composite/text-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CameraIcon } from 'lucide-react';

export const ProfileCard = () => {
    const { user } = useUser();

    const { data, setData, errors, setErrors, loading, setLoading } = useForm({
        name: user.name,
        email: user.email,
    });

    const [avatarUrl, setAvatarUrl] = useState<string | null>(getAvatarUrl(user));
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarLoading(true);
        setAvatarError(null);
        try {
            await updateAvatar(user.id, file);
            setAvatarUrl(URL.createObjectURL(file));
        } catch (e: any) {
            setAvatarError(e?.message ?? 'Failed to upload avatar.');
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateProfile(user.id, data.name, data.email);
        } catch (e: any) {
            const resData = e?.response?.data;
            if (resData?.name?.message) {
                setErrors('name', resData.name.message);
            } else if (resData?.email?.message) {
                setErrors('email', resData.email.message);
            } else {
                setErrors('name', e?.message ?? 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
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
                                    {user.name[0].toUpperCase()}
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
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>
                </div>

                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            id="name"
                            label="Display Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            autoComplete="name"
                        />
                        <EmailField
                            id="email"
                            label="Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            autoComplete="email"
                        />
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton loading={loading} label="Save Changes" />
                    </div>
                </Form>
            </CardContent>
        </Card>
    );
};
