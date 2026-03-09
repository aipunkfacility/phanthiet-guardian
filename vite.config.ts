import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Proxy для Gemini API
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
          headers: {
            'x-goog-api-key': env.VITE_GEMINI_API_KEY || ''
          }
        }
      }
    },
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') }
    }
  };
});
