;$(function() {
  'use strict';

  var asterank3d = new Asterank3D({
    container: document.getElementById('container'),
    not_supported_callback: function() {
      $('#loading').hide();
      $('#not-supported').show();
    },
    show_dat_gui: isScreenBigEnough() && !window.isIframe,
    static_prefix: '',
    camera_position: [187.52838092794164, 648.449030071106, 438.33250509398675],
    camera_fly_around: true,
  });

  asterank3d.init();

  // Other wiring
  // TODO move to ui.js
  $('#hide_sidebar').on('click', function() {
    $('#sidebar').hide();
    $('#show_sidebar_container').show();
  });
  $('#show_sidebar').on('click', function() {
    $('#sidebar').show();
    $('#show_sidebar_container').hide();
  });

  var ui = new MeteorsUi(asterank3d);
  ui.init();

  function isScreenBigEnough() {
    return $(window).width() > 760;
  }
});
