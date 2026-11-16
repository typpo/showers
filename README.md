# meteor-showers

This project renders debris clouds in the solar system.  When the Earth passes through a cloud, we experience a meteor shower!

# About

The project is online at: https://www.meteorshowers.org/.  It uses data from [NASA CAMS](http://cams.seti.org/), and was built with feedback from project leader Peter Jenniskens.

This is a modified version of [Asterank](http://github.com/typpo/asterank)'s 3D code, which is another project of mine.

![](http://i.imgur.com/muPvVzt.jpg)

# Installation & Usage

Requires Node.js 22.18 or newer. Install dependencies with `npm ci`.

- `npm run dev` runs the app in the local Workers runtime at http://localhost:8988/.
- `npm test` builds and tests the production Worker, routes, redirects, and datasets.
- `npm run build` produces deployable output in `.cloudflare/output/v0/`.
- `npm run preview` serves that production build locally at http://localhost:8988/.
- `npm run deploy` builds and deploys the Worker using Cloudflare's `cf` CLI.

# License

Copyright 2017 Ian Webster - MIT License
