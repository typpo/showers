import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { prepare } from './scripts/prepare.js';

export default defineConfig(async () => {
  await prepare();
  return {
    publicDir: '.generated/assets',
    plugins: [cloudflare()],
    server: { port: 8988 },
  };
});
