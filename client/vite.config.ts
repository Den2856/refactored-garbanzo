import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // все запросы начинающиеся с /api/ будут прокситься на бэкенд
      '/api': {
        target: 'https://refactored-garbanzo-3msd.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
