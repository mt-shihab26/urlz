import { AuthLayout } from '#/components/layouts/auth-layout';
import { Button } from '#/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { cn } from '#/lib/utils';
import { route } from '#/lib/route';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
import * as React from 'react';

function ResetPassword() {
    const [password, setPassword] = React.useState('');
    const [confirm, setConfirm] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);

    const mismatch = confirm.length > 0 && password !== confirm;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mismatch || password.length < 8) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDone(true);
        }, 1200);
    };

    const passwordStrength = (() => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
        if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500 dark:bg-green-400', width: '100%' };
    })();

    if (done) {
        return (
            <AuthLayout>
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-500/10">
                            <CheckIcon className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-xl">Password updated</CardTitle>
                        <CardDescription>
                            Your password has been reset successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">
                            <Link to={route.signIn()}>Sign in with new password</Link>
                        </Button>
                    </CardContent>
                </Card>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Set new password</CardTitle>
                    <CardDescription>Must be at least 8 characters</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">New password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            {passwordStrength && (
                                <div className="flex items-center gap-2">
                                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="confirm">Confirm new password</Label>
                            <Input
                                id="confirm"
                                type="password"
                                placeholder="••••••••"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                autoComplete="new-password"
                                className={cn(
                                    mismatch &&
                                        'border-destructive focus-visible:ring-destructive/30',
                                )}
                            />
                            {mismatch && (
                                <p className="text-xs text-destructive">Passwords don't match</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || mismatch || password.length < 8}
                        >
                            {loading ? 'Updating…' : 'Reset password'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center">
                    <Link
                        to={route.signIn()}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeftIcon className="size-3.5" />
                        Back to sign in
                    </Link>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
export default ResetPassword;
