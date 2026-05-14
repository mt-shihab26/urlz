import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { Form } from '#/components/composite/form';
import { AuthLayout } from '#/components/layouts/auth-layout';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, MailIcon } from 'lucide-react';

export const Route = createFileRoute('/dashboard/_guest/forgot-password')({
    component: () => {
        const [email, setEmail] = useState('');
        const [loading, setLoading] = useState(false);
        const [sent, setSent] = useState(false);

        const handleSubmit = () => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setSent(true);
            }, 1200);
        };

        if (sent) {
            return (
                <AuthLayout>
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                                <MailIcon className="size-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Check your email</CardTitle>
                            <CardDescription>
                                We sent a password reset link to{' '}
                                <span className="font-medium text-foreground">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <p className="text-center text-sm text-muted-foreground">
                                Didn't receive it? Check your spam folder or{' '}
                                <button
                                    onClick={() => setSent(false)}
                                    className="font-medium text-foreground hover:underline"
                                >
                                    try again
                                </button>
                                .
                            </p>
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

        return (
            <AuthLayout>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Forgot your password?</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a reset link
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending…' : 'Send reset link'}
                            </Button>
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
    },
});
