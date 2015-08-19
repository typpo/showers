;function Asterank3D(opts) {
  'use strict';

  var me = this;

  /** Options and defaults **/
  opts.static_prefix = typeof opts.static_prefix === 'undefined' ?
    '/static' : opts.static_prefix;
  opts.default_camera_position = opts.camera_position || [0, -136, 113];
  opts.camera_fly_around = typeof opts.camera_fly_around === 'undefined' ?
    true : opts.camera_fly_around;
  opts.jed_delta = opts.jed_delta || 0.25;
  opts.meteoroid_factor = opts.meteoroid_factor || 6;
  opts.custom_object_fn = opts.custom_object_fn || null;
  opts.object_texture_path = opts.object_texture_path ||
    opts.static_prefix + "img/cloud4.png";
  opts.not_supported_callback = opts.not_supported_callback || function() {};
  opts.sun_scale = opts.sun_scale || 50;
  opts.show_dat_gui = opts.show_dat_gui || false;
  opts.top_object_color = opts.top_object_color ?
      new THREE.Color(opts.top_object_color) : new THREE.Color(0xDBDB70);
  opts.milky_way_visible = opts.milky_way_visible || true;

  // requestAnimFrame polyfill
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  /** Constants **/
  var WEB_GL_ENABLED = true
    , MAX_NUM_ORBITS = 4000
    , NUM_BIG_PARTICLES = 25;   // show this many asteroids with orbits

  /** Other variables **/
  var stats, scene, renderer, composer
    , camera, cameraControls
    , pi = Math.PI
    , using_webgl = false
    , object_movement_on = true
    , lastHovered
    , added_objects = []
    , planets = []
    , planet_orbits_visible = true
    , jed = toJED(new Date())
    , particle_system_geometry = null
    , asteroids_loaded = false
    , display_date_last_updated = 0
    , first_loaded = false
    , skyBox = null

  // Lock/feature stuff
  var feature_map = {}       // map from object full name to Orbit3D instance
    , locked_object = null
    , locked_object_ellipse = null
    , locked_object_idx = -1
    , locked_object_size = -1
    , locked_object_color = -1

  // 2012 da14 special case
  var featured_2012_da14 = getParameterByName('2012_DA14') === '1';

  // glsl and webgl stuff
  var attributes
    , uniforms
    , particleSystem

  // Initialization
  init();
  if (opts.show_dat_gui) {
    initGUI();
  }

  $('#btn-toggle-movement').on('click', function() {
    object_movement_on = !object_movement_on;
  });
  $('#controls .js-sort').on('click', function() {
    runAsteroidQuery($(this).data('sort'));
    $('#controls .js-sort').css('font-weight', 'normal');
    $(this).css('font-weight', 'bold');
  });

  // 2012 DA14 feature special case
  if (featured_2012_da14) {
    jed = toJED(new Date('2012-11-01'));
    if (typeof mixpanel !== 'undefined') mixpanel.track('2012_da14 special');
  }

  function initGUI() {
    var ViewUI = function() {
      this['Display date'] = '12/26/2012';
      this['Speed'] = opts.jed_delta;
      //this['Meteoroid speed'] = opts.meteoroid_factor;
      this['Show orbits'] = planet_orbits_visible;
      this['Show Milky Way'] = opts.milky_way_visible;
    };

    window.onload = function() {
      var text = new ViewUI();
      var gui = new dat.GUI({width: 300});
      gui.add(text, 'Display date').onChange(function(val) {
        var newdate = new Date(Date.parse(val));
        if (newdate) {
          var newjed = toJED(newdate);
          changeJED(newjed);
          if (!object_movement_on) {
            render(true); // force rerender even if simulation isn't running
          }
        }
      }).listen();
      gui.add(text, 'Speed', 0, 30).onChange(function(val) {
        opts.jed_delta = val / 30;
        var was_moving = object_movement_on;
        object_movement_on = opts.jed_delta > 0;
      });
      /*
      gui.add(text, 'Meteoroid speed', 1, 30).onChange(function(val) {
        opts.meteoroid_factor = val;
        for (var i = 0; i < added_objects.length; i++) {
          if (i >= planets.length) {
            // Adjust artificial speed for comet particles.
            attributes.P.value[i] =
              attributes.realP.value[i] / opts.meteoroid_factor;
          }
        }
        attributes.P.needsUpdate = true;
      });
      */
      gui.add(text, 'Show orbits').onChange(function() {
        togglePlanetOrbits();
      });
      gui.add(text, 'Show Milky Way').onChange(function() {
        toggleMilkyWay();
      });
      window.datgui = text;
    }; // end window onload
  } // end initGUI

  function togglePlanetOrbits() {
    if (planet_orbits_visible) {
      for (var i=0; i < planets.length; i++) {
        scene.remove(planets[i].getEllipse());
      }
    }
    else {
      for (var i=0; i < planets.length; i++) {
        scene.add(planets[i].getEllipse());
      }
    }
    planet_orbits_visible = !planet_orbits_visible;
  }

  function toggleMilkyWay() {
    skyBox.visible = opts.milky_way_visible = !opts.milky_way_visible;
  }

  function isWebGLSupported() {
    return WEB_GL_ENABLED && Detector.webgl;
  }

  function init(){
    // Sets up the scene
    $('#loading-text').html('renderer');
    if (isWebGLSupported()){
      renderer = new THREE.WebGLRenderer({
        antialias		: true	// to get smoother output
        //preserveDrawingBuffer	: true	// to allow screenshot
      });
      renderer.setClearColor(0x000000, 1);
      using_webgl = true;
      window.gl = renderer.getContext();
    }
    else {
      opts.not_supported_callback();
      return;
    }
    var $container = $(opts.container);
    var containerHeight = $container.height();
    var containerWidth = $container.width();
    renderer.setSize(containerWidth, containerHeight);
    opts.container.appendChild(renderer.domElement);

    THREEx.WindowResize(renderer, camera);

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    var cameraH	= 3;
    var cameraW	= cameraH / containerHeight * containerWidth;
    window.cam = camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 1, 5000);

    // TODO include libs for this
    /*
    THREEx.WindowResize(renderer, camera, opts.container);    // handle window resize
    // Fullscreen api
    if (THREEx.FullScreen && THREEx.FullScreen.available()) {
      THREEx.FullScreen.bindKey();
    }
   */

    setDefaultCameraPosition();
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera);

    cameraControls = new THREE.TrackballControls(camera, opts.container);
    cameraControls.staticMoving = true;
    cameraControls.panSpeed = 2;
    cameraControls.zoomSpeed = 3;
    cameraControls.rotateSpeed = 3;
    cameraControls.maxDistance = 2200;
    cameraControls.dynamicDampingFactor = 0.5;
    window.cc = cameraControls;

    // Rendering solar system

    // "sun" - 0,0 marker
    $('#loading-text').html('sun');
    var texture = loadTexture(opts.static_prefix + 'img/sunsprite.png');
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      useScreenCoordinates: false,
      color: 0xffffff
    }));
    sprite.scale.x = opts.sun_scale;
    sprite.scale.y = opts.sun_scale;
    sprite.scale.z = 1;
    scene.add(sprite);

    // Ellipses
    $('#loading-text').html('planets');
    var mercury = new Orbit3D(Ephemeris.mercury,
        {
          color: 0x913CEE, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-mercury.jpg',
          display_color: new THREE.Color(0x913CEE),
          particle_geometry: particle_system_geometry,
          name: 'Mercury'
        });
    scene.add(mercury.getEllipse());
    var venus = new Orbit3D(Ephemeris.venus,
        {
          color: 0xFF7733, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-venus.jpg',
          display_color: new THREE.Color(0xFF7733),
          particle_geometry: particle_system_geometry,
          name: 'Venus'
        });
    scene.add(venus.getEllipse());
    var earth = new Orbit3D(Ephemeris.earth,
        {
          color: 0x009ACD, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-earth.jpg',
          display_color: new THREE.Color(0x009ACD),
          particle_geometry: particle_system_geometry,
          name: 'Earth'
        });
    scene.add(earth.getEllipse());
    feature_map['earth'] = {
      orbit: earth,
      idx: 2
    };
    var mars = new Orbit3D(Ephemeris.mars,
        {
          color: 0xA63A3A, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-mars.jpg',
          display_color: new THREE.Color(0xA63A3A),
          particle_geometry: particle_system_geometry,
          name: 'Mars'
        });
    scene.add(mars.getEllipse());
    var jupiter = new Orbit3D(Ephemeris.jupiter,
        {
          color: 0xFFB90F, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-jupiter.jpg',
          display_color: new THREE.Color(0xFFB90F),
          particle_geometry: particle_system_geometry,
          name: 'Jupiter'
        });
    scene.add(jupiter.getEllipse());
    var saturn = new Orbit3D(Ephemeris.saturn,
        {
          color: 0x336633, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-saturn.jpg',
          display_color: new THREE.Color(0x996633),
          particle_geometry: particle_system_geometry,
          name: 'Saturn'
        });
    scene.add(saturn.getEllipse());
    var uranus = new Orbit3D(Ephemeris.uranus,
        {
          color: 0x0099FF, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-uranus.jpg',
          display_color: new THREE.Color(0x0099FF),
          particle_geometry: particle_system_geometry,
          name: 'uranus'
        });
    scene.add(uranus.getEllipse());
    var neptune = new Orbit3D(Ephemeris.neptune,
        {
          color: 0x3333FF, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/texture-neptune.jpg',
          display_color: new THREE.Color(0x3333FF),
          particle_geometry: particle_system_geometry,
          name: 'neptune'
        });
    scene.add(neptune.getEllipse());
    /*
    var comet169pneat = new Orbit3D(Ephemeris.comet169pneat,
        {
          color: 0xccffff, width: 1, jed: jed, object_size: 1.7,
          display_color: new THREE.Color(0xccffff),
          particle_geometry: particle_system_geometry,
          name: '169P/NEAT'
        });
    scene.add(comet169pneat.getEllipse());
    */
    var comet = new Orbit3D(Ephemeris.cometSwiftTuttle,
        {
          color: 0xccffff, width: 1, jed: jed, object_size: 1.7,
          display_color: new THREE.Color(0xccffff),
          particle_geometry: particle_system_geometry,
          name: 'Comet Thatcher'
        });
    scene.add(comet.getEllipse());

    planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune,
      comet];
    if (featured_2012_da14) {
      // Special: 2012 DA14
      var asteroid_2012_da14 = new Orbit3D(Ephemeris.asteroid_2012_da14,
          {
            color: 0xff0000, width: 1, jed: jed, object_size: 1.7,
          texture_path: opts.static_prefix + 'img/cloud4.png',   // not using loadTexture, no support for offline mode...
          display_color: new THREE.Color(0xff0000),
          particle_geometry: particle_system_geometry,
          name: '2012 DA14'
          });
      scene.add(asteroid_2012_da14.getEllipse());
      feature_map['2012 DA14'] = {
        orbit: asteroid_2012_da14,
        idx: 5
      };
      planets.push(asteroid_2012_da14);
    }

    // Skybox
    var geometry = new THREE.SphereGeometry(2800, 60, 40);
    var uniforms = {
      texture: { type: 't', value: loadTexture(opts.static_prefix + 'img/eso_dark.jpg') }
    };

    var material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-density').textContent
    });

    skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.rotation.z = pi/2;
    skyBox.rotation.x = pi;
    skyBox.renderDepth = 1000.0;
    scene.add(skyBox);
    window.skyBox = skyBox;

    if (opts.run_asteroid_query) {
      runAsteroidQuery();
    }

    $(opts.container).on('mousedown', function() {
      opts.camera_fly_around = false;
    });

    window.renderer = renderer;
  }  // end init

  function setNeutralCameraPosition() {
    // Follow floating path around
    var timer = 0.0001 * Date.now();
    cam.position.x = opts.default_camera_position[0] + Math.sin(timer) * 25;
    //cam.position.y = Math.sin( timer ) * 100;
    cam.position.z = opts.default_camera_position[2] + Math.cos(timer) * 20;
  }

  function setDefaultCameraPosition() {
    cam.position.set(opts.default_camera_position[0], opts.default_camera_position[1],
        opts.default_camera_position[2]);
  }

  function setHighlight(full_name) {
    // Colors the object differently, but doesn't follow it.
    var mapped_obj = feature_map[full_name];
    if (!mapped_obj) {
      alert("Sorry, something went wrong and I can't highlight this object.");
      return;
    }
    var orbit_obj = mapped_obj.orbit;
    if (!orbit_obj) {
      alert("Sorry, something went wrong and I can't highlight this object.");
      return;
    }
    var idx = mapped_obj.idx; // this is the object's position in the added_objects array
    attributes.value_color.value[idx] = new THREE.Color(0x0000ff);
    attributes.size.value[idx] = 30.0;
    attributes.locked.value[idx] = 1.0;
    setAttributeNeedsUpdateFlags();
  }

  // camera locking fns
  function clearLock(set_default_camera) {
    if (!locked_object) return;

    if (set_default_camera) {
      setDefaultCameraPosition();
    }

    cameraControls.target = new THREE.Vector3(0,0,0);

    // restore color and size
    attributes.value_color.value[locked_object_idx] = locked_object_color;
    attributes.size.value[locked_object_idx] = locked_object_size;
    attributes.locked.value[locked_object_idx] = 0.0;
    setAttributeNeedsUpdateFlags();
    if (locked_object_idx >= planets.length) {
      // not a planet
      scene.remove(locked_object_ellipse);
    }

    locked_object = null;
    locked_object_ellipse = null;
    locked_object_idx = -1;
    locked_object_size = -1;
    locked_object_color = null;

    // reset camera pos so subsequent locks don't get into crazy positions
    setNeutralCameraPosition();
  }   // end clearLock

  function setLock(full_name) {
    if (locked_object) {
      clearLock();
    }

    var mapped_obj = feature_map[full_name];
    if (!mapped_obj) {
      alert("Sorry, something went wrong and I can't lock on this object.");
      return;
    }
    var orbit_obj = mapped_obj['orbit'];
    if (!orbit_obj) {
      alert("Sorry, something went wrong and I can't lock on this object.");
      return;
    }
    locked_object = orbit_obj;
    locked_object_idx = mapped_obj['idx']; // this is the object's position in the added_objects array
    locked_object_color = attributes.value_color.value[locked_object_idx];
    attributes.value_color.value[locked_object_idx] = full_name === 'earth' ?
      new THREE.Color(0x00ff00) : new THREE.Color(0xff0000);
    locked_object_size = attributes.size.value[locked_object_idx];
    attributes.size.value[locked_object_idx] = 30.0;
    attributes.locked.value[locked_object_idx] = 1.0;
    setAttributeNeedsUpdateFlags();

    locked_object_ellipse = locked_object.getEllipse();
    scene.add(locked_object_ellipse);
    opts.camera_fly_around = true;
  } // end setLock

  function handleSimulationResults(e, particles) {
    var data = e.data;
    switch(data.type) {
      case 'result':
        // queue simulation results
        var positions = data.value.positions;

        for (var i=0; i < positions.length; i++) {
          particles[i].MoveParticleToPosition(positions[i]);
        }

        if (typeof datgui !== 'undefined') {
          // update with date
          var now = new Date().getTime();
          if (now - display_date_last_updated > 500) {
            var georgian_date = fromJED(data.value.jed);
            datgui['display date'] = georgian_date.getMonth()+1 + "/"
              + georgian_date.getDate() + "/" + georgian_date.getFullYear();
            display_date_last_updated = now;
          }
        }
        break;
      case 'debug':
        console.log(data.value);
        break;
      default:
        console.log('Invalid data type', data.type);
    }
  }

  function runAsteroidQuery(sort) {
    sort = sort || 'score';
    $('#loading').show();

    // Get new data points
    $('#loading-text').html('asteroids database');
    if (typeof passthrough_vars !== 'undefined' && passthrough_vars.offline_mode) {
      setTimeout(function() {
        // Timeout for rest of class to initialize...
        var data = window.passthrough_vars.rankings[sort];
        me.processAsteroidRankings(data);
      }, 0);
    } else if (window.ORBIT_DATA.length == 1) {
      var base = window.ORBIT_DATA[0];
      var data = [base];
      var between = function(min, max) {
        return Math.random() * (min - max) + max;
      }
      for (var i=0; i < 500; i++) {
        var variant = $.extend(true, {}, base);
        variant.epoch = Math.random() * variant.epoch;
        variant.a = variant.a * between(0.4, 1.1);
        variant.e = variant.e * between(0.99, 1.01);
        variant.i = variant.i * between(0.99, 1.01);
        //variant.ma = variant.ma * between(0.99, 1.01);
        //variant.p = 2 * Math.PI *
         // Math.sqrt(Math.pow(variant.a, 3) / 132712440018/86400);
        delete variant.p;
        data.push(variant);
      }
      setTimeout(function() {
        me.processAsteroidRankings(data);
      }, 0);
    } else {
      var data = window.ORBIT_DATA;
      for (var i=0; i < 2; i++) {
        data.push.apply(data, window.ORBIT_DATA);
      }
      setTimeout(function() {
        me.processAsteroidRankings(window.ORBIT_DATA);
      }, 0);
    }
  }

  function createParticleSystem() {
    // attributes
    attributes = {
      a: { type: 'f', value: [] },
      e: { type: 'f', value: [] },
      i: { type: 'f', value: [] },
      o: { type: 'f', value: [] },
      ma: { type: 'f', value: [] },
      n: { type: 'f', value: [] },
      w: { type: 'f', value: [] },
      P: { type: 'f', value: [] },
      realP: { type: 'f', value: [] },
      epoch: { type: 'f', value: [] },
      size: { type: 'f', value: [] },
      value_color : { type: 'c', value: [] },

      // attributes can't be bool or int in some versions of opengl
      locked: { type: 'f', value: [] },
      is_planet: { type: 'f', value: [] }
    };

    uniforms = {
      color: { type: 'c', value: new THREE.Color( 0xffffff ) },
      jed: { type: 'f', value: jed },
      earth_i: { type: 'f', value: Ephemeris.earth.i },
      earth_om: { type: 'f', value: Ephemeris.earth.om },
      planet_texture:
        { type: 't', value: loadTexture(opts.static_prefix + 'img/cloud4.png') },
      small_roid_texture:
        { type: 't', value: loadTexture(opts.object_texture_path) },
      small_roid_circled_texture:
        { type: 't', value: loadTexture(opts.static_prefix + 'img/cloud4-circled.png') }
    };
    var particle_system_shader_material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      attributes:     attributes,
      vertexShader:   document.getElementById('orbit-vertex-shader').textContent,
      fragmentShader: document.getElementById('orbit-fragment-shader').textContent
    });
    particle_system_shader_material.depthTest = false;
    particle_system_shader_material.vertexColor = true;
    particle_system_shader_material.transparent = true;
    particle_system_shader_material.blending = THREE.AdditiveBlending;

    for (var i = 0; i < added_objects.length; i++) {
      if (i < planets.length) {
        attributes.size.value[i] = 150;
        attributes.is_planet.value[i] = 1.0;
      } else {
        attributes.size.value[i] = added_objects[i].opts.object_size;
        //attributes.size.value[i] = 175;
        attributes.is_planet.value[i] = 0.0;
      }

      attributes.a.value[i] = added_objects[i].eph.a;
      attributes.e.value[i] = added_objects[i].eph.e;
      attributes.i.value[i] = added_objects[i].eph.i;
      attributes.o.value[i] = added_objects[i].eph.om;
      attributes.ma.value[i] = added_objects[i].eph.ma || 0; // TODO
      attributes.n.value[i] = added_objects[i].eph.n || -1.0;
      attributes.w.value[i] = added_objects[i].eph.w_bar ||
        (added_objects[i].eph.w + added_objects[i].eph.om);
      attributes.realP.value[i] = attributes.P.value[i] =
        added_objects[i].eph.p || Math.sqrt(
          Math.pow(added_objects[i].eph.a, 3)) * 365.256;  // TODO
      if (i >= planets.length) {
        // Artificial speed for comet
        attributes.P.value[i] /= opts.meteoroid_factor;
      }
      attributes.epoch.value[i] = added_objects[i].eph.epoch ||
        Math.random() * 2451545.0; // TODO
      attributes.value_color.value[i] = added_objects[i].opts.display_color ||
        new THREE.Color(0xff00ff); // TODO
      attributes.locked.value[i] = 0.0;
      particle_system_geometry.vertices.push(new THREE.Vector3(0,0,0));
    }  // end added_objects loop
    setAttributeNeedsUpdateFlags();

    particleSystem = new THREE.ParticleSystem(
      particle_system_geometry,
      particle_system_shader_material
    );
    window.ps = particleSystem;

    // add it to the scene
    scene.add(particleSystem);
  }

  function setAttributeNeedsUpdateFlags() {
    attributes.value_color.needsUpdate = true;
    attributes.locked.needsUpdate = true;
    attributes.size.needsUpdate = true;
  }

  function starTexture(color, size) {
    size = (size) ? parseInt(size*24, 10) : 24;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var col = new THREE.Color(color);

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    var rgbaString = 'rgba(' + ~~ ( col.r * 255 ) + ',' + ~~ ( col.g * 255 ) + ',' + ~~ ( col.b * 255 ) + ',' + (1) + ')';
    gradient.addColorStop( 0, rgbaString);
    gradient.addColorStop( 0.1, rgbaString);
    gradient.addColorStop( 0.6, 'rgba(125, 20, 0, 0.2)' );
    gradient.addColorStop( -1.92, 'rgba(0,0,0,0)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    return canvas;
  }

  function changeJED(new_jed) {
    jed = new_jed;
  }

  function animate() {
    // animation loop
    if (!asteroids_loaded) {
      render();
      requestAnimFrame(animate);
      return;
    }

    if (opts.camera_fly_around) {
      if (locked_object) {
        // Follow locked object
        var pos = locked_object.getPosAtTime(jed);
        if (featured_2012_da14 && locked_object.name === 'Earth') {
          cam.position.set(pos[0]-20, pos[1]+20, pos[2]+20);
        }
        else {
          //cam.position.set(pos[0]+50, pos[1]+50, pos[2]+50);
          cam.position.set(pos[0]+25, pos[1]-25, pos[2]-70);
        }
        cameraControls.target = new THREE.Vector3(pos[0], pos[1], pos[2]);
      } else {
        setNeutralCameraPosition();
      }
    }

    render();
    requestAnimFrame(animate);
  }

  function render(force) {
    // render the scene at this timeframe

    // update camera controls
    cameraControls.update();

    // update display date
    var now = new Date().getTime();
    if (now - display_date_last_updated > 500 && typeof datgui !== 'undefined') {
      var georgian_date = fromJED(jed);
      datgui['Display date'] = georgian_date.getMonth()+1 + "/"
        + georgian_date.getDate() + "/" + georgian_date.getFullYear();
      display_date_last_updated = now;
    }

    if (object_movement_on || force) {
      // update shader vals for asteroid cloud
      uniforms.jed.value = jed;
      jed += opts.jed_delta;
    }

    // actually render the scene
    renderer.render(scene, camera);
  }

  /** Fuzzy price **/

  var fuzzes = [
    {
      word: 'trillion',
      num: 1000000000000
    },
    {
      word: 'billion',
      num: 1000000000
    },
    {
      word: 'million',
      num: 1000000
    }
  ];

  function fuzzy_price(n) {
    for (var i=0; i < fuzzes.length; i++) {
      var x = fuzzes[i];
      if (n / x.num >= 1) {
        var prefix = (n / x.num);
        if (i === -1 && prefix > 100)
          return '>100 ' + x.word;
        return prefix.toFixed(2) + ' ' + x.word;
      }
    }
    return n;
  }

  function loadTexture(path) {
    if (typeof passthrough_vars !== 'undefined' && passthrough_vars.offline_mode) {
      // same origin policy workaround
      var b64_data = $('img[data-src="' + path + '"]').attr('src');

      var new_image = document.createElement( 'img' );
      var texture = new THREE.Texture( new_image );
      new_image.onload = function()  {
        texture.needsUpdate = true;
      };
      new_image.src = b64_data;
      return texture;
    }
    return THREE.ImageUtils.loadTexture(path);
  }

  /** Public functions **/

  me.clearRankings = function() {
    // Remove any old setup
    for (var i=0; i < added_objects.length; i++) {
      scene.remove(added_objects[i].getParticle());
    }
    clearLock(true);
    if (particleSystem) {
      scene.remove(particleSystem);
      particleSystem = null;
    }

    if (lastHovered) {
      scene.remove(lastHovered);
    }
  };

  me.clearLock = function() {
    return clearLock(true);
  };

  me.setLock = function(full_name) {
    return setLock(full_name);
  };

  me.isWebGLSupported = function() {
    return isWebGLSupported();
  };

  me.processAsteroidRankings = function(data) {
    if (!data) {
      alert('Sorry, something went wrong and the server failed to return data.');
      return;
    }
    var n = data.length;
    console.log('Loading', n);
    // add planets
    added_objects = planets.slice();
    particle_system_geometry = new THREE.Geometry();

    for (var i=0; i < planets.length; i++) {
      // FIXME this is a workaround for the poor handling of PSG vertices in ellipse.js
      // needs to be cleaned up
      particle_system_geometry.vertices.push(new THREE.Vector3(0,0,0));
    }

    var useBigParticles = !using_webgl;
    var featured_count = 0;
    var featured_html = '';
    for (var i=0; i < n; i++) {
      if (i === NUM_BIG_PARTICLES) {
        if (!using_webgl) {
          // only show objects of interest if there's no particlesystem support
          break;
        }
        useBigParticles = false;
      }
      var roid = data[i];
      if (roid.a >= 999) {
        continue;
      }
      var locked = false;
      var orbit;
      if (opts.custom_object_fn) {
        var orbit_params = opts.custom_object_fn(roid);
        orbit_params.particle_geometry = particle_system_geometry; // will add itself to this geometry
        orbit_params.jed = jed;
        orbit = new Orbit3D(roid, orbit_params, useBigParticles);
      }
      else {
        var display_color = /*i < NUM_BIG_PARTICLES ?
            opts.top_object_color :*/ displayColorForObject(roid);
        orbit = new Orbit3D(roid, {
          color: 0xcccccc,
          display_color: display_color,
          width: 2,
          object_size: i < NUM_BIG_PARTICLES ? 50 : 30, //1.5,
          jed: jed,
          particle_geometry: particle_system_geometry // will add itself to this geometry
        }, useBigParticles);
      }

      // Add it to featured list
      feature_map[roid.full_name] = {
        'orbit': orbit,
        'idx': added_objects.length
      };
      /*
      // TODO(@ian) all this specific objects-of-interest/featured stuff
      // needs to be moved out of 3d code.
      if (featured_count++ < NUM_BIG_PARTICLES) {
        featured_html += '<tr data-full-name="'
          + roid.full_name
          + '"><td><a href="#">'
          + (roid.prov_des || roid.full_name)
          + '</a></td><td>'
          + (roid.price < 1 ? 'N/A' : '$' + fuzzy_price(roid.price))
          + '</td></tr>';
      }
      */

      // Add to list of objects in scene
      added_objects.push(orbit);
    } // end asteroid results for loop

    // handle when view mode is switched - need to clear every row but the sun
    /*
    if (featured_2012_da14) {
      $('#objects-of-interest tr:gt(2)').remove();
    }
    else {
      $('#objects-of-interest tr:gt(1)').remove();
    }
    $('#objects-of-interest').append(featured_html).on('click', 'tr', function() {
      $('#objects-of-interest tr').css('background-color', '#000');
      var $e = $(this);
      var full_name = $e.data('full-name');
      $('#sun-selector').css('background-color', 'green');
      switch (full_name) {
        // special case full names
        case 'sun':
          clearLock(true);
          return false;
        case '2012 DA14':
          // highlight the earth too
          //setHighlight('earth');
          break;
      }
      clearLock();

      // set new lock
      $e.css('background-color', 'green');
      $('#sun-selector').css('background-color', '#000');
      setLock(full_name);

      return false;
    });
    $('#objects-of-interest-container').show();
    */

    jed = toJED(new Date());  // reset date
    if (!asteroids_loaded) {
      asteroids_loaded = true;
    }
    createParticleSystem();   // initialize and start the simulation

    /*
    if (featured_2012_da14) {
      setLock('earth');
      $('#sun-selector').css('background-color', 'black');
      $('#earth-selector').css('background-color', 'green');
    }
   */

    if (!first_loaded) {
      animate();
      first_loaded = true;
    }

    $('#loading').hide();

    if (typeof mixpanel !== 'undefined') mixpanel.track('simulation started');
  };    // end processAsteroidRankings

  me.pause = function() {
    object_movement_on = false;
  };

  me.play = function() {
    object_movement_on = true;
  };
}
