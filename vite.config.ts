import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Esta seção é crucial para o login funcionar
    proxy: {
      // Redireciona requisições que começam com /api para o backend
      '/api': {
        target: 'http://localhost:3001', // Seu servidor backend
        changeOrigin: true, // Necessário para evitar erros de CORS
        secure: false,
      },
    },
  },
});
