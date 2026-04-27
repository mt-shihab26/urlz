import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Dashboard } from './pages/dashboard';

export const App = () => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
};
