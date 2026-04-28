import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Overview } from './pages/overview';
import { Links } from './pages/links';
import { LinkDetail } from './pages/link-detail';
import { Analytics } from './pages/analytics';
import { Settings } from './pages/settings';

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/overview" replace />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/links" element={<Links />} />
                        <Route path="/links/:id" element={<LinkDetail />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
