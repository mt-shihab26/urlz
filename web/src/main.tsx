import './main.css';

import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@/components/theme-provider.tsx';
import { StrictMode } from 'react';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
);
