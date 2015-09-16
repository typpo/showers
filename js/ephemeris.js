window.Ephemeris = {
  asteroid_2012_da14: {
    full_name: '2012 DA14',
    ma: 299.99868,
    epoch: 2456200.5,
    n: 0.98289640,
    a: 1.0018381,
    e: 0.1081389,
    i: 10.33722,

    w_bar: 58.33968,
    w: 271.07725,   // ARGUMENT of perihelion.  argument = longitude of perihelion - longitude of ascending node
    om: 147.26243,

    p: 365.256
  },

  // http://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
  // http://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf
  mercury: {
    full_name: 'Mercury',
    ma: 174.79252722,
    epoch: 2451545.0,
    a: 0.38709927,
    e: 0.20563593,
    i: 7.00497902,
    w_bar: 77.45779628,
    w: 29.12703035,
    L: 252.25032350,
    om: 48.33076593,
    p: 87.969
  },
  venus: {
    full_name: 'Venus',
    ma: 50.37663232,
    epoch: 2451545.0,
    a: 0.72333566,
    e: 0.00677672,
    i: 3.39467605,
    w_bar: 131.60246718,
    w: 54.92262463,
    L: 181.97909950,
    om: 76.67984255,
    p: 224.701
  },
  earth: {
    full_name: 'Earth',
    ma: -2.47311027,
    epoch: 2451545.0,
    a:1.00000261,
    e: 0.01671123,
    i: 0.00001531,
    w_bar: 102.93768193,
    w: 102.93768193,
    L: 100.46457166,
    om: 0,
    p: 365.256
  },
  mars:{
    full_name: 'Mars',
    ma: 19.39019754,
    epoch: 2451545.0,
    a: 1.52371034,
    e: 0.09339410,
    i: 1.84969142,
    w_bar: -23.94362959,   // longitude of perihelion
    w: -73.5031685,   // argument of perihelion
    L: -4.55343205,    // mean longitude
    om: 49.55953891,    // longitude of ascending node
    p: 686.980
  },
  jupiter: {
    full_name: 'Jupiter',
    ma: 19.66796068,
    epoch: 2451545.0,
    a: 5.20288700,
    e: 0.04838624,
    i: 1.30439695,
    w_bar: 14.72847983,
    w: -85.74542926,
    L: 34.39644051,
    om: 100.47390909,
    p: 4332.589
  },
  saturn: {
    full_name: 'Saturn',
    ma: 145.143217,
    epoch: 2451545.0,
    a: 9.53707032,
    e: 0.05415060,
    i: 2.48446,
    w_bar: 92.43194,
    //w: -85.74542926,
    L: 49.94432,
    om: 113.71504,
    p: 10759.22
  },
  uranus: {
    full_name: 'Uranus',
    ma: 207.0243,
    epoch: 2451545.0,
    a: 19.19126393,
    e: 0.04716771,
    i: 0.76986,
    w_bar: 170.96424,
    //w: -85.74542926,
    L: 313.23218,
    om: 74.22988,
    p: 30685.4
  },
  neptune: {
    full_name: 'Neptune',
    ma: 289.8025,
    epoch: 2451545.0,
    a: 30.06896348,
    e: 0.00858587,
    i: 1.76917,
    w_bar: 44.97135,
    //w: -85.74542926,
    L: 304.88003,
    om: 131.72169,
    p: 60189
  },
  comet169pneat: {
    full_name: '169P/NEAT',
    ma: 153.0171365009687,
    epoch: 2454283.5,
    a: 2.60425566574427,
    e: 0.7669369023710906,
    i: 11.30467189031702,
    w: 217.9759064340549, // arg of perihelion
    om: 176.2211702605364,
    p: 1535.05469180196
  },
  cometThatcher: {
    full_name: '1861 G1',
    ma: -0.0234598,
    epoch: 2400920.5,
    a: 55.6818869,
    e: 0.983465,
    i: 79.7733,
    w: 213.4496, // arg of perihelion
    om: 31.8674,
    p: 151578.75
  },
  cometSwiftTuttle: {
    full_name: 'Comet 109P/Swift-Tuttle',
    epoch: 2450000.5,
    a: 26.0920694978266,
    e: 0.963225755046038,
    q: 0.959516155068868,
    i: 113.453816997171,
    om: 139.3811920815948, // long of ascending node, aka 'node' in sbdb
    w: 152.9821676305871, // arg of peri, aka 'peri' in sbdb
    ma: 7.631696167124212, // mean anomaly, aka 'M' in sbdb
    p: 48681.19346262312, // period
    n: 0.007395052881692476, // mean motion
    Q: 51.22462284058444, // aphelion
  },
};

for (var x in Ephemeris) {
  if (Ephemeris.hasOwnProperty(x) && Ephemeris[x].w_bar && Ephemeris[x].L) {
    Ephemeris[x].ma = Ephemeris[x].L - Ephemeris[x].w_bar;
  }
}
