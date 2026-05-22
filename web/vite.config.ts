import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [
        tanstackDevtools(),
        tailwindcss(),
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
            generatedRouteTree: 'src/tree.gen.ts',
        }),
        react(),
    ],
});
