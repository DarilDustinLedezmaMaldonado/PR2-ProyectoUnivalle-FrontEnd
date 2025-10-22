import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // A small manualChunks strategy to split big vendor bundles
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendors'
            if (id.includes('framer-motion')) return 'framer-motion'
            if (id.includes('lodash')) return 'lodash'
            // put everything else from node_modules in `vendor`
            return 'vendor'
          }
        }
      }
    },
    // increase warning limit to avoid noisy warnings during build
    chunkSizeWarningLimit: 1000
  }
})
