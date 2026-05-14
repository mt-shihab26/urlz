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

import { EmailField } from '#/components/composite/email-field';
import { Form } from '#/components/composite/form';
import { SubmitButton } from '#/components/composite/submit-button';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, MailIcon } from 'lucide-react';

export const Route = createFileRoute('/dashboard/_guest/forgot-password')({
    head: () => ({ meta: [{ title: 'Forgot Password — urlz' }] }),
    component: ForgotPassword,
});

function ForgotPassword() {
    const [sent, setSent] = useState(false);

    const { data, setData, errors, loading, setLoading } = useForm({ email: '' });

    const handleSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1200);
    };

    if (sent) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <MailIcon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Check your email</CardTitle>
                    <CardDescription>
                        We sent a password reset link to{' '}
                        <span className="font-medium text-foreground">{data.email}</span>
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
        );
    }

    return (
        <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot your password?</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <EmailField
                            id="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                            autoComplete="email"
                        />
                        <SubmitButton loading={loading} label="Send reset link" />
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
    );
}
