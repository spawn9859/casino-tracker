import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/casino-tracker/', // Set base to repository name for GitHub Pages
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
})
