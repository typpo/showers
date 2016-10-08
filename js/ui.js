function MeteorsUi(visualization) {
  MeteorsUi.prototype.init = function() {
    $('.toggle-summary').on('click', function() {
      $('#summary').toggleClass('minimized').toggleClass('maximized');
    });

    if (window.isMobile) {
      $('#sky-map').hide();
    } else {
      $('#sky-map img').on('click', function() {
        $('#skymap-modal').empty().append($(this).clone()).modal();
      });
    }

    setupButtonHandlers();
    setupModalPlugin();
  }

  function setupButtonHandlers() {
    $('#restore-view').on('click', function() {
      visualization.clearLock();
      // TODO shouldn't really have to call these both.
      visualization.setDefaultCameraPosition();
      visualization.setNeutralCameraPosition();
    });

    $('#lock-earth').on('click', function() {
      visualization.setLockMode('FOLLOW');
      visualization.setLock('earth');
    });

    $('#lock-earth-view').on('click', function() {
      visualization.setLockMode('VIEW_FROM');
      visualization.setLock('earth');
    });
  }

  function setupModalPlugin() {
    $.modal.defaults.opacity = 0.4;
    $.modal.defaults.zIndex = 9999999;
  }
}
