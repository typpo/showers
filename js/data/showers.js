window.METEOR_CLOUD_DATA = {
  'Perseids': {
    name: 'Perseids',
    peak: 'mid-August',
    date: '8/12',
    map: 'perseids_north.jpg',
    iau_number: 7,
    // TODO comet struct
    source_name: 'Swift-Tuttle',
    source_orbit: {
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
  'Leonids': {
    name: 'Leonids',
    peak: 'mid-November',
    date: '11/18',
    map: 'leonids_north.jpg',
    iau_number: 13,
    source_name: 'Tempel-Tuttle',
    source_orbit: {
      full_name: 'Comet 55P/Tempel-Tuttle',
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
  'Alpha Capricornids': {
    name: 'Alpha Capricornids',
    peak: 'late July',
    date: '7/31',
    iau_number: 1,
    source_name: '169P/NEAT',
    source_orbit: {
      full_name: 'Comet 169P/NEAT',
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
  'Lyrids': {
    name: 'Lyrids',
    peak: 'April',
    date: '4/22',
    map: 'lyrids_north.jpg',
    iau_number: 6,
    source_name: 'C/1861 G1 Thatcher',
    source_orbit: {
      full_name: 'Comet C/1861 G1 Thatcher',
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
    pictures: [
      {
        url: 'http://astrobob.areavoices.com/files/2012/04/Lyrids-2011-12_30April-232-1024x698.jpg',
        caption: '',
      },
    ],
    full_orbit_data: window.Lyrid,
  },
  'Orionids': {
    name: 'Orionids',
    peak: 'late October',
    date: '10/21',
    map: 'orionids_north.jpg',
    iau_number: 8,
    source_name: 'Halley',
    source_orbit: {
      full_name: 'Comet 1P/Halley',
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
  },
  'Eta Aquariids': {
    name: 'Eta Aquariids',
    peak: 'early May',
    date: '5/5',
    map: 'eta_aquarids_north.jpg',
    iau_number: 31,
    source_name: 'Halley',
    source_orbit: {
      full_name: 'Comet 1P/Halley',
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
  },
  'Quadrantids': {
    source_type: 'asteroid',
    name: 'Quadrantids',
    peak: 'early January',
    date: '1/3',
    iau_number: 10,
    map: 'quadrantids_north.jpg',
    // TODO comet struct
    source_name: '2003 EH1',
    source_orbit: {
      full_name: 'Asteroid 2003 EH1',
      epoch: 2457000.5,
      a: 3.122076326984469,
      e: 0.6190846552236009,
      q: 1.189246780511523,
      i: 70.87628080581905,
      om: 282.9631889304927, // long of ascending node, aka 'node' in sbdb
      w: 171.352056383936, // arg of peri, aka 'peri' in sbdb
      ma: 48.43591036347674, // mean anomaly, aka 'M' in sbdb
      p: 2014.947343719152, // period in days
      Q: 5.054905873457415, // aphelion
    }
  },
  'Delta Aquariids': {
    name: 'Delta Aquariids',
    peak: 'late July',
    date: '7/28',
    map: 'delta_aquarids_north.jpg',
    iau_number: 26,
    source_name: 'Machholz',
    source_orbit: {
      full_name: 'Comet 96P/Machholz',
      epoch: 2456541.5,
      a: 3.033939724939583,
      e: 0.9592118287498192,
      q: 0.123748853063562,
      i: 58.31221423529453,
      om: 94.32323631127545, // long of ascending node, aka 'node' in sbdb
      w: 14.75774840136655, // arg of peri, aka 'peri' in sbdb
      ma: 77.99276065152682, // mean anomaly, aka 'M' in sbdb
      p: 1930.229059113251, // period, in days
    }
  },
  'Southern Taurids': {
    name: 'Southern Taurids',
    peak: 'October',
    date: '10/10',
    iau_number: 2,
    source_name: 'Encke',
    source_orbit: {
      full_name: 'Comet 2P/Encke',
      epoch: 2457260.5,
      a: 2.215132168119717,
      e: 0.8483353543281217,
      q: 0.3359572353942565,
      i: 11.78145516019895,
      om: 334.5681964371267, // long of ascending node, aka 'node' in sbdb
      w: 186.5460141528601, // arg of peri, aka 'peri' in sbdb
      ma: 191.9830650931392, // mean anomaly, aka 'M' in sbdb
      p: 1204.197975688157, // period, in days
    }
  },
  'Northern Taurids': {
    name: 'Northern Taurids',
    peak: 'November',
    date: '11/12',
    iau_number: 17,
    source_name: 'Encke',
    source_orbit: {
      full_name: 'Comet 2P/Encke',
      epoch: 2457260.5,
      a: 2.215132168119717,
      e: 0.8483353543281217,
      q: 0.3359572353942565,
      i: 11.78145516019895,
      om: 334.5681964371267, // long of ascending node, aka 'node' in sbdb
      w: 186.5460141528601, // arg of peri, aka 'peri' in sbdb
      ma: 191.9830650931392, // mean anomaly, aka 'M' in sbdb
      p: 1204.197975688157, // period, in days
    }
  },
  'Geminids': {
    // TODO: fewer particles
    source_type: 'asteroid',
    name: 'Geminids',
    peak: 'mid-December',
    date: '12/14',
    map: 'geminids_north.jpg',
    iau_number: 4,
    source_name: 'Phaethon',
    source_orbit: {
      full_name: 'Asteroid 3200 Phaethon',
      epoch: 2457000.5,
      a: 1.271171408008421,
      e: 0.8898360011148798,
      q: 0.1400373255746363,
      i: 22.23995071185812,
      // long of ascending node, aka 'node' in sbdb
      om: 265.2652193975989,
      // arg of peri, aka 'peri' in sbdb
      w: 322.143726872288,
      // mean anomaly, aka 'M' in sbdb
      ma: 293.7610538532383,
      // period, in days
      p: 523.4854325174181,
    }
  },
  'Ursids': {
    source_type: 'comet',
    name: 'Ursids',
    peak: 'mid-December',
    date: '12/21',
    map: 'ursids_north.jpg',
    iau_number: 15,
    source_name: 'Tuttle',
    source_orbit: {
      full_name: 'Comet 8P/Tuttle',
      epoch: 2454374.5,
      a: 5.6998620708785754374048,
      e: 0.8197997470243816309221,
      q: 1.0271165870984511059305,
      i: 54.983184844602092766763,
      // long of ascending node, aka 'node' in sbdb
      om: 270.3416520050764,
      // arg of peri, aka 'peri' in sbdb
      w: 207.5092459727414,
      // mean anomaly, aka 'M' in sbdb
      ma: 351.4516245290291,
      // period, in days
      p: 4970.441269280825,
    }
  },
};
