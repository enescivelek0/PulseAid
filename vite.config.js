import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: { port: 8080, host: true, open: true },
  build: { target: 'es2019', sourcemap: false },
});
