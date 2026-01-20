import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Optimera chunk-storlekar
    rollupOptions: {
      output: {
        manualChunks: {
          // Separera stora dependencies till egna chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['lucide-react', 'react-hot-toast', 'zustand'],
        },
      },
    },
    // Öka chunk-storleksgränsen för bättre komprimering
    chunkSizeWarningLimit: 1000,
    // Använd esbuild för snabbare minifiering
    minify: 'esbuild',
  },
})
