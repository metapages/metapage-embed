import { defineConfig } from 'vite'
import path from 'node:path';
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.ts'),
            name: path.basename(__dirname).replaceAll('-', '_'),
            formats: ['es', 'umd'],
            fileName: (format) => `${path.basename(__dirname)}.${format}.js`,
        },
        rollupOptions: {
            // external: ['react', 'react-dom', 'styled-components'],
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    // 'styled-components': 'styled',
                },
            },
        },
    },
});
