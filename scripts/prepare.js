import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import nunjucks from 'nunjucks';
import uglify from 'uglify-js';

export async function prepare() {
  const output = resolve('.generated');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  // CAMS datasets are symlinked from public/js/data into data/.
  // Materialize them so deployment contains files, not local symlinks.
  await cp('public', `${output}/assets`, { recursive: true, dereference: true });

  const lists = await Promise.all(['config/vendor.list', 'config/app.list'].map(path => readFile(path, 'utf8')));
  const files = lists.join('\n').split('\n').map(line => line.trim()).filter(Boolean);
  const sources = Object.fromEntries(await Promise.all(files.map(async path => [path, await readFile(path, 'utf8')])));
  // Preserve the original global script order and names used by Three.js plugins.
  const result = uglify.minify(sources, { compress: false, mangle: false });
  if (result.error) throw result.error;
  const hash = createHash('sha256').update(result.code).digest('hex').slice(0, 16);
  const bundleUrl = `/dist/bundle-${hash}.js`;
  await mkdir(`${output}/assets/dist`, { recursive: true });
  await writeFile(`${output}/assets${bundleUrl}`, result.code);
  await writeFile(`${output}/bundle.js`, `export const bundleUrl = ${JSON.stringify(bundleUrl)};\n`);

  // Workers prohibit runtime code generation. Compile Nunjucks at build time
  // and ship only its slim runtime plus this precompiled template.
  const compiled = nunjucks.precompileString(await readFile('templates/index.html', 'utf8'), {
    name: 'index.html',
    wrapper: templates => `export default (function() {\n${templates[0].template}\n})();\n`,
  });
  await writeFile(`${output}/template.js`, compiled);
}
