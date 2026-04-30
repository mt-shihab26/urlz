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
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const DangerZoneCard = () => {
    const { user } = useUser();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteAccount(user.id);
        } catch (e: any) {
            setError(e?.message ?? 'Something went wrong.');
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
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="confirm-email">Email</Label>
                                <Input
                                    id="confirm-email"
                                    placeholder={user.email}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                {error && <p className="text-xs text-destructive">{error}</p>}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setInput('')}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    disabled={input !== user.email || loading}
                                    onClick={handleDelete}
                                >
                                    {loading ? 'Deleting…' : 'Delete Account'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
};
