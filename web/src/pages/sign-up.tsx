import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

import { signUp } from '#/collections/users';
import { useForm } from '#/hooks/use-form';
import { route } from '#/routes';
import { useNavigate } from '@tanstack/react-router';

import { CheckboxField } from '#/components/composite/checkbox-field';
import { EmailField } from '#/components/composite/email-field';
import { Form } from '#/components/composite/form';
import { GoogleOAuthButton } from '#/components/composite/google-oauth-button';
import { LinkPrompt } from '#/components/composite/link-prompt';
import { OrDivider } from '#/components/composite/or-divider';
import { PasswordField } from '#/components/composite/password-field';
import { PasswordStrength } from '#/components/composite/password-strength';
import { SubmitButton } from '#/components/composite/submit-button';
import { TextField } from '#/components/composite/text-field';
import { AuthLayout } from '#/components/layouts/auth-layout';

const SignUp = () => {
    const navigate = useNavigate();

    const { data, setData, errors, setErrors, loading, setLoading } = useForm({
        name: '',
        email: '',
        password: '',
        agreed: false,
    });

    const handleSubmit = async () => {
        if (!data.agreed) return;
        setLoading(true);
        try {
            await signUp(data.name, data.email, data.password);
            navigate({ to: route.overviewIndex() });
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
                    <GoogleOAuthButton />
                    <OrDivider />
                    <Form onSubmit={handleSubmit}>
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
                            <PasswordStrength password={data.password} />
                        </PasswordField>
                        <CheckboxField
                            id="terms"
                            checked={data.agreed}
                            onCheckedChange={(v) => setData('agreed', v)}
                        >
                            <span>I agree to the</span>
                            <span className="font-medium text-foreground hover:underline cursor-pointer">
                                Terms of Service
                            </span>
                            <span>and</span>
                            <span className="font-medium text-foreground hover:underline cursor-pointer">
                                Privacy Policy
                            </span>
                        </CheckboxField>
                        <SubmitButton
                            loading={loading}
                            disabled={!data.agreed}
                            label="Create account"
                        />
                    </Form>
                </CardContent>
                <CardFooter>
                    <LinkPrompt
                        text="Already have an account?"
                        linkText="Sign in"
                        linkTo={route.signIn()}
                    />
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default SignUp;
