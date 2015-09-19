;(function() {
  'use strict';

  var pi = Math.PI, sin = Math.sin, cos = Math.cos;
  var PIXELS_PER_AU = 50;

  var Orbit3D = function(eph, opts) {
    opts = opts || {};
    opts.width = opts.width || 1;
    opts.object_size = opts.object_size || 1;
    opts.jed =  opts.jed || 2451545.0;

    this.opts = opts;
    this.eph = eph;
  };

  Orbit3D.prototype.createOrbit = function() {
    var pts;
    var points;
    var time = this.opts.jed;
    var pts = [];
    var limit = this.eph.p + 1;
    var parts = this.eph.e > .20 ? 1200 : 300;   // Extra precision for high eccentricity.
    parts = this.eph.a > 10 ? parts + 10000 : parts;
    var delta = Math.ceil(limit / parts);
    var prev;
    for (var i=0; i <= parts; i++, time+=delta) {
      var pos = this.getPosAtTime(time);
      if (isNaN(pos[0]) || isNaN(pos[1]) || isNaN(pos[2])) {
        console.error('NaN position value - you may have bad data in the following ephemeris:');
        console.log(this.eph);
      }
      var vector = new THREE.Vector3(pos[0], pos[1], pos[2]);
      prev = vector;
      pts.push(vector);
    }

    points = new THREE.Geometry();
    points.vertices = pts;
    points.computeLineDistances(); // Required for dotted lines.

    return points;
  };

  Orbit3D.prototype.getPosAtTime = function(jed) {
    // Note: logic below must match the vertex shader.
    // This position calculation is used to create orbital ellipses.
    var e = this.eph.e;
    var a = this.eph.a;
    var i = (this.eph.i) * pi/180;
    var o = (this.eph.om) * pi/180; // longitude of ascending node
    // LONGITUDE of perihelion
    var p = (this.eph.w_bar || this.eph.w + this.eph.om) * pi/180;
    var ma = this.eph.ma;
    var M;
    // Calculate mean anomaly at jed
    ma = ma * pi/180;
    var n = 2*pi / this.eph.p;
    var epoch = this.eph.epoch;
    var d = jed - epoch;
    M = ma + n * d;

    // Estimate eccentric and true anom using iterative approx
    var E0 = M;
    var lastdiff;
    do {
      var E1 = M + e * sin(E0);
      lastdiff = Math.abs(E1-E0);
      E0 = E1;
    } while(lastdiff > 0.0000001);
    var E = E0;
    var v = 2 * Math.atan(Math.sqrt((1+e)/(1-e)) * Math.tan(E/2));

    // Radius vector, in AU
    var r = a * (1 - e*e) / (1 + e * cos(v)) * PIXELS_PER_AU;

    // Hekliocentric coords
    var X = r * (cos(o) * cos(v + p - o) - sin(o) * sin(v + p - o) * cos(i))
    var Y = r * (sin(o) * cos(v + p - o) + cos(o) * sin(v + p - o) * cos(i))
    var Z = r * (sin(v + p - o) * sin(i))
    var ret = [X, Y, Z];
    return ret;
  };

  Orbit3D.prototype.getEllipse = function() {
    if (!this.ellipse) {
      var pointGeometry = this.createOrbit(this.opts.jed);
      this.ellipse = new THREE.Line(pointGeometry,
        new THREE.LineDashedMaterial({
          color: this.opts.color,
          linewidth: 1,
          dashSize: 2,
          gapSize: 0.5
        }), THREE.LineStrip);
    }
    return this.ellipse;
  };

  // Returns a generously proportioned ellipse. Used for intersection.
  Orbit3D.prototype.getFatEllipse = function() {
    if (!this.fatEllipse) {
      var pointGeometry = this.createOrbit(this.opts.jed);
      this.fatEllipse = new THREE.Line(pointGeometry,
        new THREE.LineBasicMaterial({
          transparent: true,
          linewidth: 10,
        }), THREE.LineStrip);
    }
    return this.fatEllipse;
  };

  window.Orbit3D = Orbit3D;
})();
