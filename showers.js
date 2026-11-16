import nunjucks from 'nunjucks/browser/nunjucks-slim.js';
import cloudData from './cloud_data.js';
import templateCode from './.generated/template.js';
import { bundleUrl, scriptUrls } from './.generated/bundle.js';

const environment = new nunjucks.Environment([], { autoescape: true });
const template = new nunjucks.Template({ type: 'code', obj: templateCode }, environment);

// HTML escaping alone is insufficient inside a script element.
function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'meteorshowers.org' ||
        (url.hostname === 'www.meteorshowers.org' && url.protocol === 'http:')) {
      url.protocol = 'https:';
      url.hostname = 'www.meteorshowers.org';
      return Response.redirect(url.href, 301);
    }

    const view = url.pathname.match(/^\/view\/([^/]+)\/?$/i);
    if (url.pathname !== '/' && !view) {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    let shower = '';
    let canonicalPath = '/';
    if (view) {
      try {
        shower = decodeURIComponent(view[1]);
      } catch {
        return new Response('Bad request', { status: 400 });
      }
      // Keep the canonical URLs the Express site published, since backlinks
      // point at them: the requested slug as written (hyphens or spaces), and
      // for featured IAU numbers the shower's page.
      canonicalPath = `/view/${encodeURIComponent(shower)}`;
      // Use the catalogue key, not its display name (e.g. Perseids vs Perseid).
      if (/^iau-\d+$/.test(shower)) {
        const number = Number(shower.slice(4));
        const featured = Object.keys(cloudData).find(key => cloudData[key].iau_number === number);
        if (featured) {
          shower = featured;
          canonicalPath = `/view/${encodeURIComponent(featured)}`;
        }
      } else {
        shower = shower.replace(/-/g, ' ');
      }
    }

    const html = template.render({
      shower,
      showerJson: scriptJson(shower),
      showerCloud: cloudData[shower || 'Perseids'],
      cloudDataJson: scriptJson(cloudData),
      bundleUrl,
      scriptUrls,
      canonicalUrl: `https://www.meteorshowers.org${canonicalPath}`,
    });
    return new Response(request.method === 'HEAD' ? null : html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  },
};
