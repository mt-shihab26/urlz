import { devtools } from '@tanstack/devtools-vite';
import { defineConfig } from 'vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    server: { port: 5173 },
    plugins: [
        devtools(),
        nitro(),
        tailwindcss(),
        tanstackStart({ router: { generatedRouteTree: 'tree.gen.ts' } }),
        viteReact(),
    ],
});

export default config;
