import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Écoute sur toutes les interfaces réseau
    port: 5173, // Port par défaut (vous pouvez le changer)
    strictPort: false, // Utilise un autre port si celui-ci est occupé
  }
})
