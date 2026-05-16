import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Vite draait ALTIJD op 5173
    open: true,        // Browser opent automatisch op http://localhost:5173
    strictPort: true,  // Vite mag NOOIT een andere poort kiezen
  }
})
