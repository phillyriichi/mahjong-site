import { globSync } from 'glob';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postBuild from './post-build';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), postBuild()],
  // Trying to get the dev server to re-write just the /src/pages part of the path without affecting the prod build is a massive PITA
  // base: '/src/pages',
  // server: {
  //   proxy: {
  //     '/': {
  //       forward: 'http://localhost:5173/src/pages',
  //     },
  //   }
  // },
  build: {
    rollupOptions: {
      // ensures we have one entry point per page; this is useful for SEO and lets us customize <head> tags
      input: Object.fromEntries(
        globSync('src/pages/**/*.html').map(file => [
          path.relative(
            'src/pages',
            file.slice(0, file.length - path.extname(file).length)
          ),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
    }
  }
});
