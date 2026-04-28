import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Analytics } from '@/pages/analytics';
import { ForgotPassword } from '@/pages/forgot-password';
import { LinkDetail } from '@/pages/link-detail';
import { Links } from '@/pages/links';
import { Overview } from '@/pages/overview';
import { ResetPassword } from '@/pages/reset-password';
import { Settings } from '@/pages/settings';
import { SignIn } from '@/pages/sign-in';
import { SignUp } from '@/pages/sign-up';

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/overview" replace />} />
                        {/* App */}
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/links" element={<Links />} />
                        <Route path="/links/:id" element={<LinkDetail />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* Auth */}
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
