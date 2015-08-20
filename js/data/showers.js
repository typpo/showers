window.METEOR_CLOUD_DATA = {
  'Perseid': {
    name: 'Perseid',
    date: 'mid-August',
    comet: 'Swift-Tuttle',
    orbit_data: [
      {
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
        //n: 0.007395052881692476, // mean motion
        Q: 51.22462284058444, // aphelion
      }
    ]
  },
  'Leonid': {
    name: 'Leonid',
    date: 'mid-November',
    comet: 'Tempel-Tuttle',
    orbit_data: [
      {
        full_name: '55P/Tempel-Tuttle',
        epoch: 2451040.5,
        a: 10.3383382297577,
        e: 0.905552720972412,
        q: 0.976427915467506,
        i: 162.486575379434,
        om: 235.270989149082, // long of ascending node, aka 'node' in sbdb
        w: 172.5002736828059, // arg of peri, aka 'peri' in sbdb
        ma: 4.97833968468816, // mean anomaly, aka 'M' in sbdb
        p: 12141.56115249823, // period
      }
    ]
  }
};
