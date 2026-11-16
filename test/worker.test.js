import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import cloudData from '../cloud_data.js';

const output = resolve('.cloudflare/output/v0/workers/default');
const config = JSON.parse(await readFile(`${output}/worker.config.json`, 'utf8'));
const mf = new Miniflare(convertV4MiniflareOptions({
  name: config.name,
  modules: true,
  scriptPath: `${output}/bundle/index.js`,
  compatibilityDate: config.compatibilityDate,
  assets: {
    directory: `${output}/assets`,
    binding: 'ASSETS',
    run_worker_first: config.assets.runWorkerFirst,
    routerConfig: { has_user_worker: true },
    assetConfig: { html_handling: config.assets.htmlHandling, not_found_handling: config.assets.notFoundHandling },
  },
  cf: false,
}));
after(() => mf.dispose());
const get = (path, init) => mf.dispatchFetch(`https://www.meteorshowers.org${path}`, init);

function selection(html) {
  return JSON.parse(html.match(/window\.shower_selection = (.*);/)[1]);
}

test('homepage renders metadata, cloud catalogue, shaders, and a loadable bundle', async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /href="https:\/\/www\.meteorshowers\.org\/"/);
  assert.match(html, /id="orbit-vertex-shader"/);
  assert.match(html, /window\.METEOR_CLOUD_DATA = /);
  assert.doesNotMatch(html, /\{%|\{\{/);
  const bundle = html.match(/src="(\/dist\/bundle-[^"]+)"/)[1];
  const script = await get(bundle);
  assert.equal(script.status, 200);
  assert.match(await script.text(), /Asterank3D/);
});

test('every named shower loads through encoded spaces and hyphenated links', async () => {
  for (const [name, cloud] of Object.entries(cloudData)) {
    for (const slug of [encodeURIComponent(name), name.replaceAll(' ', '-')]) {
      const response = await get(`/view/${slug}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.equal(selection(html), name);
      assert.ok(html.includes(`<span id="meteor-shower-name">${cloud.name}</span>`));
    }
  }
});

test('featured IAU links use the catalogue key, while other IAU embeds remain selectable', async () => {
  for (const [name, cloud] of Object.entries(cloudData)) {
    if (cloud.iau_number === undefined) continue;
    const response = await get(`/view/iau-${cloud.iau_number}`);
    assert.equal(response.status, 200);
    assert.equal(selection(await response.text()), name);
  }
  for (const id of ['iau-873', 'all']) {
    assert.equal(selection(await (await get(`/view/${id}/`)).text()), id);
  }
});

test('canonical URLs match the ones the Express site published', async () => {
  const canonical = async path =>
    (await (await get(path)).text()).match(/<link rel="canonical" href="([^"]*)">/)[1];
  const cases = {
    '/': '/',
    '/view/Southern-Delta-Aquariids': '/view/Southern-Delta-Aquariids',
    '/view/Southern%20Delta%20Aquariids': '/view/Southern%20Delta%20Aquariids',
    '/view/Leonids/': '/view/Leonids',
    '/view/iau-13': '/view/Leonids',
    '/view/iau-7': '/view/Perseids',
    '/view/iau-873': '/view/iau-873',
    '/view/all': '/view/all',
  };
  for (const [path, expected] of Object.entries(cases)) {
    assert.equal(await canonical(path), `https://www.meteorshowers.org${expected}`, path);
  }
});

test('both CAMS datasets and public assets are served by the assets binding', async () => {
  for (const path of ['/js/data/cams_splits/iau_7.json', '/js/data/cams_splits_2016/iau_873.json', '/js/data/oer.json', '/css/main.css', '/img/cloud4.png']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const source = await readFile(`public${path}`);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), source, path);
  }
});

test('every source CAMS file is copied into the deployment as a regular file', async () => {
  for (const dataset of ['cams_splits', 'cams_splits_2016']) {
    for (const name of await readdir(`data/${dataset}`)) {
      const target = `${output}/assets/js/data/${dataset}/${name}`;
      assert.ok((await stat(target)).isFile());
      assert.deepEqual(await readFile(target), await readFile(`data/${dataset}/${name}`));
    }
  }
});

test('apex and HTTP redirects preserve paths and query parameters', async () => {
  for (const origin of ['https://meteorshowers.org', 'http://meteorshowers.org', 'http://www.meteorshowers.org']) {
    for (const path of ['/view/iau-7?embed=1', '/css/main.css?v=1']) {
      const response = await mf.dispatchFetch(`${origin}${path}`, { redirect: 'manual' });
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('location'), `https://www.meteorshowers.org${path}`);
    }
  }
});

test('HEAD, unsupported methods, malformed URLs, and missing assets return appropriate responses', async () => {
  const head = await get('/view/Leonids', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await get('/', { method: 'POST' })).status, 405);
  assert.equal((await get('/view/%E0%A4%A')).status, 400);
  assert.equal((await get('/missing.json')).status, 404);
  assert.equal((await get('/view/a/b')).status, 404);
});

test('URL input cannot escape HTML attributes or inline script elements', async () => {
  const value = '\"\'><script>alert(1)</script>\u2028';
  const response = await get(`/view/${encodeURIComponent(value)}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal(selection(html), value);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /\\u003cscript>/);
});
