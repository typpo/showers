import { bindings, defineConfig } from 'cf/config';

export default defineConfig({
  accountId: '2d93479a0c78707f4517a9335fba6388',
  worker: {
    name: 'meteorshowers',
    entrypoint: './showers.js',
    // Latest date supported by the pinned local Workers runtime.
    compatibilityDate: '2026-11-11',
    workersDev: false,
    domains: ['www.meteorshowers.org', 'meteorshowers.org'],
    triggers: [],
    env: { ASSETS: bindings.assets() },
    assets: {
      // The apex redirect must also cover static asset requests.
      runWorkerFirst: true,
      htmlHandling: 'none',
      notFoundHandling: 'none',
    },
    observability: {
      enabled: true,
      headSamplingRate: 0.1,
      traces: { enabled: true, headSamplingRate: 0.1 },
    },
  },
});
