import * as React from 'react';
import { Link } from 'react-router';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function SignUp() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [agreed, setAgreed] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 1200);
    };

    const passwordStrength = (() => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
        if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500 dark:bg-green-400', width: '100%' };
    })();

    return (
        <AuthLayout>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>Start shortening links for free</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    {/* Social */}
                    <Button variant="outline" type="button" className="w-full gap-2">
                        <GoogleIcon />
                        Continue with Google
                    </Button>

                    <div className="flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jamie Chen"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>

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

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
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

                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms"
                                checked={agreed}
                                onCheckedChange={(v) => setAgreed(!!v)}
                                className="mt-0.5"
                            />
                            <Label
                                htmlFor="terms"
                                className="cursor-pointer text-sm font-normal leading-relaxed"
                            >
                                I agree to the{' '}
                                <span className="font-medium text-foreground hover:underline cursor-pointer">
                                    Terms of Service
                                </span>{' '}
                                and{' '}
                                <span className="font-medium text-foreground hover:underline cursor-pointer">
                                    Privacy Policy
                                </span>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !agreed}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Already have an account?&nbsp;
                    <Link to="/sign-in" className="font-medium text-foreground hover:underline">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}
