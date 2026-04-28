import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useState } from 'react';

import { GoogleIcon } from '@/components/icons/google-icon';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="flex flex-col gap-4"
                    >
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

                        <Button type="submit" className="w-full" disabled={loading || !agreed}>
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
};

export default SignUp;
