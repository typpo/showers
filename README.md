# meteor-showers

This project renders debris clouds in the solar system.  When the Earth passes through a cloud, we experience a meteor shower!

# About

The project is online at: https://www.meteorshowers.org/.  It uses data from [NASA CAMS](http://cams.seti.org/), and was built with feedback from project leader Peter Jenniskens.

This is a modified version of [Asterank](http://github.com/typpo/asterank)'s 3D code, which is another project of mine.

![](http://i.imgur.com/muPvVzt.jpg)

# Installation & Usage

Requires Node.js 22.18 or newer. Install the pinned dependencies with `npm ci`.

- `npm run dev` runs the app in the local Workers runtime at http://localhost:8988/.
- `npm test` builds and tests the production Worker, routes, redirects, and datasets.
- `npm run build` produces deployable output in `.cloudflare/output/v0/`.
- `npm run preview` serves that production build locally at http://localhost:8988/.
- `npm run deploy` builds and deploys the Worker using Cloudflare's `cf` CLI.

The build compiles the Nunjucks template ahead of time, creates a content-hashed
JavaScript bundle from `config/vendor.list` and `config/app.list`, and copies
`public/` into Workers Static Assets. The CAMS dataset symlinks are dereferenced
so both datasets are included in every deployment. Generated files are ignored
by Git. There is no manual bundle filename to update. Restart the dev server
after changing templates, frontend source files, or datasets so they are rebuilt.

# Deployment

`cloudflare.config.ts` defines the `meteorshowers` Worker and its `ASSETS` binding.
The compatibility date matches the newest date supported by the pinned local
runtime. Logs and traces are enabled with 10% sampling. There are no application
secrets, database bindings, background jobs, or origin-server requests.

Authenticate with `npx cf auth login`, or set `CLOUDFLARE_API_TOKEN` for CI.
The token needs permission to deploy Workers scripts and routes in the configured
account and read the `meteorshowers.org` zone. Use `npx cf deploy --dry-run` to
validate the build without publishing it.

The production routes cover `www.meteorshowers.org/*` and `meteorshowers.org/*`.
The Worker redirects the apex hostname and HTTP requests to HTTPS on `www`,
preserving paths and query strings. Named showers, `/view/iau-N` iframe links,
and `/view/all` retain their existing URLs. Missing assets return 404 responses.

Before migration, the live site returned Express headers and the January 2020
JavaScript bundle through Cloudflare's proxy. The origin is the Linode server
`grunthos`, reachable as `gate.ianww.com` (`97.107.131.22`). Its systemd service
`gate-node-showers.service` runs `/home/ian/showers/showers.js` on port 8988,
using Node 22.23.4 under `/opt/gate-node-runtime/22.23.4`. The removed PM2/Upstart
scripts predate that systemd setup.
Workers routes now intercept all site requests before they reach that origin.
The existing DNS records and original server are retained for rollback. Removing
the two Workers routes returns traffic to that server. Redeploying an earlier
Worker version is the preferred rollback after subsequent Worker releases.

# License

Copyright 2017 Ian Webster - MIT License
