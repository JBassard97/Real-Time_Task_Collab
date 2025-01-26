import { defineConfig } from 'vite/dist/node/index.js'
import react from '@vitejs/plugin-react/dist/index.d.mts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  }
})
