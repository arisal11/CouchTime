import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true exposes the dev server on your LAN so phones can load the app
  // via the host machine's IP (e.g. http://192.168.1.20:5173).
  server: {
    host: true,
    port: 5173,
  },
})
