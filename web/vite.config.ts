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
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'vendor-react';
                    }
                    if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3')) {
                        return 'vendor-charts';
                    }
                    if (id.includes('node_modules/@tanstack/')) {
                        return 'vendor-tanstack';
                    }
                    if (
                        id.includes('node_modules/lucide-react/') ||
                        id.includes('node_modules/sonner/') ||
                        id.includes('node_modules/vaul/') ||
                        id.includes('node_modules/@base-ui/')
                    ) {
                        return 'vendor-ui';
                    }
                    if (id.includes('node_modules/')) {
                        return 'vendor-misc';
                    }
                },
            },
        },
    },
});
