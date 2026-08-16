import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 5174 so the site dev server doesn't collide with the app frontend on 5173.
  server: { port: 5174 },
})
