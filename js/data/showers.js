window.METEOR_CLOUD_DATA = {
  'Perseid': {
    name: 'Perseid',
    peak: 'mid-August',
    // TODO comet struct
    comet_name: 'Swift-Tuttle',
    comet_orbit: {
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
  },
  'Leonid': {
    name: 'Leonid',
    peak: 'mid-November',
    date: 'November 18',
    comet_name: 'Tempel-Tuttle',
    comet_orbit: {
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
  },
  'Capricornid': {
    name: 'Capricornid',
    peak: 'late July',
    date: 'July 31',
    comet_name: '169P/NEAT',
    comet_orbit: {
      full_name: '169P/NEAT',
      epoch: 2454306.5,
      a: 2.604263020070025,
      e: 0.7669213009105551,
      q: 0.6069982368046702,
      i: 11.30426956301453,
      om: 176.2198405695179, // long of ascending node, aka 'node' in sbdb
      w: 217.9762263570652, // arg of peri, aka 'peri' in sbdb
      ma: 158.4168571978383, // mean anomaly, aka 'M' in sbdb
      p: 1535.061194216666, // period
    },
    full_orbit_data: window.Capricornid,
  },
  'Lyrid': {
    name: 'Lyrid',
    peak: 'April',
    comet_name: 'C/1861 G1 Thatcher',
    comet_orbit: {
      full_name: 'C/1861 G1 Thatcher',
      epoch: 2400920.5,
      a: 55.6818869,
      e: 0.983465,
      q: 0.920700,
      i: 79.7733,
      om: 31.8674, // long of ascending node, aka 'node' in sbdb
      w: 213.4496, // arg of peri, aka 'peri' in sbdb
      ma: -0.0234598, // mean anomaly, aka 'M' in sbdb
      p: 151578.75, // period
    },
    full_orbit_data: window.Lyrid,
  },
  'Orionid': {
    name: 'Orionid',
    peak: 'late October',
    comet_name: '1P/Halley',
    comet_orbit: {
      full_name: '1P/Halley',
      epoch: 2449400.5,
      a: 17.8341442925537,
      e: 0.967142908462304,
      q: 0.585978111516909,
      i: 162.262690579161,
      om: 58.42008097656843, // long of ascending node, aka 'node' in sbdb
      w: 111.3324851045177, // arg of peri, aka 'peri' in sbdb
      ma: 38.3842644764388, // mean anomaly, aka 'M' in sbdb
      p: 27509.1290731861, // period
    }
  }
  // next up: Orionids, Taurids
};
