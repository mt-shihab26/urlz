import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useForm } from '@/hooks/use-form';
import { getPasswordStrength } from '@/lib/password';
import { pb } from '@/lib/pb';

import { EmailField } from '@/components/composite/email-field';
import { PasswordField } from '@/components/composite/password-field';
import { TextField } from '@/components/composite/text-field';
import { GoogleIcon } from '@/components/icons/google-icon';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';

const SignUp = () => {
    const { data, setData, errors, setErrors, loading, setLoading } = useForm({
        name: '',
        email: '',
        password: '',
        agreed: false,
    });

    const passwordStrength = getPasswordStrength(data.password);

    const handleSubmit = async () => {
        if (!data.agreed) return;
        setLoading(true);
        try {
            await pb.collection('users').create({
                name: data.name,
                email: data.email,
                password: data.password,
                passwordConfirm: data.password,
            });
            await pb.collection('users').authWithPassword(data.email, data.password);
        } catch (e: any) {
            const resData = e?.response?.data;
            if (resData?.email?.message) {
                setErrors('email', resData.email.message);
            } else if (resData?.password?.message) {
                setErrors('password', resData.password.message);
            } else if (resData?.name?.message) {
                setErrors('name', resData.name.message);
            } else {
                setErrors('email', e?.message ?? 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                        <GoogleIcon className="size-5" />
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
                        <TextField
                            id="name"
                            label="Full name"
                            placeholder="Jamie Chen"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                            autoComplete="name"
                        />

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

                        <PasswordField
                            id="password"
                            label="Password"
                            placeholder="At least 8 characters"
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

                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms"
                                checked={data.agreed}
                                onCheckedChange={(v) => setData('agreed', !!v)}
                                className="mt-0.5"
                            />
                            <Label
                                htmlFor="terms"
                                className="cursor-pointer text-sm font-normal leading-relaxed flex flex-wrap items-center gap-1"
                            >
                                <span>I agree to the</span>
                                <span className="font-medium text-foreground hover:underline cursor-pointer">
                                    Terms of Service
                                </span>
                                <span>and</span>
                                <span className="font-medium text-foreground hover:underline cursor-pointer">
                                    Privacy Policy
                                </span>
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading || !data.agreed}>
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
