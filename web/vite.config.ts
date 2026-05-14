import { defineConfig } from 'vite';

import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        port: 5173,
    },
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [
        tanstackStart({
            router: {
                generatedRouteTree: 'tree.gen.ts',
            },
            spa: {
                enabled: true,
                prerender: {
                    outputPath: '/index.html',
                },
            },
        }),
        react(),
        tailwindcss(),
        tanstackDevtools(),
    ],
});
