import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { deleteAccount } from '@/collections/users';
import { useUser } from '@/components/providers/auth-provider';
import { useForm } from '@/hooks/use-form';

import { EmailField } from '@/components/composite/email-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export const DangerZoneCard = () => {
    const { user } = useUser();

    const { data, setData, errors, setErrors, loading, setLoading } = useForm({ email: '' });

    const handleDelete = async () => {
        setLoading(true);
        setErrors('email', null);
        try {
            await deleteAccount(user.id);
        } catch (e: any) {
            setErrors('email', e?.message ?? 'Something went wrong.');
            setLoading(false);
        }
    };

    return (
        <Card className="border-destructive/40">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                            Permanently remove all links, data, and your account.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                            Delete Account
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. Type{' '}
                                    <span className="font-medium text-foreground">
                                        {user.email}
                                    </span>{' '}
                                    to confirm.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <EmailField
                                id="confirm-email"
                                label="Email"
                                placeholder={user.email}
                                value={data.email}
                                autoComplete="off"
                                error={errors.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setData('email', '')}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    disabled={data.email !== user.email || loading}
                                    onClick={handleDelete}
                                >
                                    {loading && <Spinner className="mr-2" />}
                                    Delete Account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
};
