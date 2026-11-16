import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { prepare } from './scripts/prepare.js';

export default defineConfig(async ({ command, isPreview }) => {
  const dev = command === 'serve' && !isPreview;
  await prepare({ dev });
  return {
    publicDir: dev ? 'public' : '.generated/assets',
    plugins: [cloudflare()],
    server: { port: 8988 },
  };
});
