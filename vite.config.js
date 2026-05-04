import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = process.env.VITE_REPO_BASE || '/IncelGods/';

export default defineConfig({
  plugins: [react()],
  base: repoBase
});
