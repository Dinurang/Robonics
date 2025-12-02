import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,           // Custom port
    host: 'localhost',    // Localhost only
    open: true,           // Automatically open browser
    strictPort: true,     // Fail if port is in use
    https: false,          // Enable HTTPS
  }
})