import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true, // shortens variable names
      format: {
        comments: false, // remove comments
      },
    },
  },
  server: {
    host: '0.0.0.0',      // 👈 Allow access via IP
    port: 5173,           // or any port you prefer
    strictPort: true,     // fail if port is in use
  }
})
