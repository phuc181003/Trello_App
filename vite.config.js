import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // cho phép Vite sử dụng được process.env, mặc định thì không mà phải sử dụng thằng import.meta.env
  // https://github.com/vitejs/vite/issues...
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }

})
