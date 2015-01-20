;(function() {
  'use strict';

  var asterank3d = new Asterank3D({
    container: document.getElementById('container'),
    not_supported_callback: function() {
      $('#loading').hide();
      $('#not-supported').show();
    },
    run_asteroid_query: true,
    show_dat_gui: true,
    static_prefix: '',
    //camera_position: [18.58451231886428, -350.32000584838624, 133.3893086458709],
    camera_position: [38.58451231886428, -360.32000584838624, 193.3893086458709],
    camera_fly_around: false
  });

  // Other wiring
  $('#hide_sidebar').on('click', function() {
    $('#sidebar').hide();
    $('#show_sidebar_container').show();
  });
  $('#show_sidebar').on('click', function() {
    $('#sidebar').show();
    $('#show_sidebar_container').hide();
  });
})();
