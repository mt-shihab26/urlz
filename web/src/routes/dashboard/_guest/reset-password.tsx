import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

import { useForm } from '#/hooks/use-form';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { Form } from '#/components/composite/form';
import { PasswordField } from '#/components/composite/password-field';
import { SubmitButton } from '#/components/composite/submit-button';
import { AuthLayout } from '#/components/layouts/auth-layout';
import { Button } from '#/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';

export const Route = createFileRoute('/dashboard/_guest/reset-password')({
    component: ResetPassword,
});

function ResetPassword() {
    const [done, setDone] = useState(false);

    const { data, setData, errors, loading, setLoading } = useForm({
        password: '',
        confirm: '',
    });

    const mismatch = data.confirm.length > 0 && data.password !== data.confirm;

    const passwordStrength = (() => {
        if (data.password.length === 0) return null;
        if (data.password.length < 6)
            return { label: 'Weak', color: 'bg-destructive', width: '33%' };
        if (data.password.length < 10)
            return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500 dark:bg-green-400', width: '100%' };
    })();

    const handleSubmit = async () => {
        if (mismatch || data.password.length < 8) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDone(true);
        }, 1200);
    };

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
                            <Link to="/dashboard/sign-in">Sign in with new password</Link>
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
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <PasswordField
                            id="password"
                            label="New password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                        >
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
                        </PasswordField>
                        <PasswordField
                            id="confirm"
                            label="Confirm new password"
                            placeholder="••••••••"
                            value={data.confirm}
                            onChange={(e) => setData('confirm', e.target.value)}
                            error={mismatch ? "Passwords don't match" : errors.confirm}
                            required
                            autoComplete="new-password"
                        />
                        <SubmitButton
                            loading={loading}
                            disabled={mismatch || data.password.length < 8}
                            label="Reset password"
                        />
                    </Form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Link
                        to="/dashboard/sign-in"
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
