import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'img/brand/logo.png'],
            manifest: {
                name: 'YoGo 有夠菜',
                short_name: 'YoGo',
                description: '提供高品質芽菜種植套組、零售種子與新鮮現採盒裝芽菜。',
                theme_color: '#2d6a4f',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'img/brand/logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'img/brand/logo.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    optimizeDeps: {
        include: ['@yogo/shared']
    },
    build: {
        commonjsOptions: {
            include: [/@yogo\/shared/, /node_modules/]
        }
    },
    test: {
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/**']
    }
});
