import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { signIn } from '@/collections/users';
import { useForm } from '@/hooks/use-form';
import { route } from '@/routes';
import { useNavigate } from 'react-router';

import { CheckboxField } from '@/components/composite/checkbox-field';
import { EmailField } from '@/components/composite/email-field';
import { Form } from '@/components/composite/form';
import { GoogleOAuthButton } from '@/components/composite/google-oauth-button';
import { LinkPrompt } from '@/components/composite/link-prompt';
import { OrDivider } from '@/components/composite/or-divider';
import { PasswordField } from '@/components/composite/password-field';
import { SubmitButton } from '@/components/composite/submit-button';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Link } from 'react-router';

const SignIn = () => {
    const navigate = useNavigate();

    const { data, setData, errors, setErrors, loading, setLoading } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            navigate(route.overviewIndex());
        } catch (e: any) {
            const resData = e?.response?.data;
            if (resData?.email?.message) {
                setErrors('email', resData.email.message);
            } else if (resData?.password?.message) {
                setErrors('password', resData.password.message);
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
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to your urlz account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <GoogleOAuthButton />
                    <OrDivider />
                    <Form onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                            autoComplete="current-password"
                            labelExtra={
                                <Link
                                    to={route.forgotPassword()}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Forgot password?
                                </Link>
                            }
                        />
                        <CheckboxField
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(v) => setData('remember', v)}
                        >
                            Remember me for 30 days
                        </CheckboxField>
                        <SubmitButton loading={loading} label="Sign in" />
                    </Form>
                </CardContent>
                <CardFooter>
                    <LinkPrompt
                        text="Don't have an account?"
                        linkText="Sign up"
                        linkTo={route.signUp()}
                    />
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default SignIn;
