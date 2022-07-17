import { defineConfig } from 'vite';
import * as path from "path";
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.ts'),
            name: path.basename(__dirname).replace(/-/g, '_'),
            formats: ['es', 'umd'],
            fileName: function (format) { return "".concat(path.basename(__dirname), ".").concat(format, ".js"); }
        },
        rollupOptions: {
            // external: ['react', 'react-dom', 'styled-components'],
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
});
