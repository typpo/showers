# meteor-showers

This project renders debris clouds in the solar system.  When the Earth passes through a cloud, we experience a meteor shower!

# About

The project is online at: https://www.meteorshowers.org/.  It uses data from [NASA CAMS](http://cams.seti.org/), and was built with feedback from project leader Peter Jenniskens.

This is a modified version of [Asterank](http://github.com/typpo/asterank)'s 3D code, which is another project of mine.

![](http://i.imgur.com/muPvVzt.jpg)

# Installation & Usage

`npm install` or `yarn install` to install dependencies.

Run `node showers.js` to start the app on port 8988 (http://localhost:8988/)

A very rudimentary JS bundle is used to prepare the app for production.  Running `./build.sh` will generate a new bundle file.  Add this file to git and update the bundle in index.html.

# License

Copyright 2017 Ian Webster - MIT License
