import { useUser } from '@/components/providers/auth-provider';
import { useForm } from '@/hooks/use-form';
import { updateProfile } from '@/lib/auth';

import { EmailField } from '@/components/composite/email-field';
import { Form } from '@/components/composite/form';
import { SubmitButton } from '@/components/composite/submit-button';
import { TextField } from '@/components/composite/text-field';
import { AvatarUpload } from '@/components/screens/settings/avatar-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProfileCard = () => {
    const { user } = useUser();

    const { data, setData, errors, setErrors, loading, setLoading } = useForm({
        name: user.name,
        email: user.email,
    });

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
                <AvatarUpload user={user} />
                <Form onSubmit={handleSubmit}>
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
                    <div className="flex justify-end">
                        <SubmitButton loading={loading} label="Save Changes" />
                    </div>
                </Form>
            </CardContent>
        </Card>
    );
};
