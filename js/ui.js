function MeteorsUi(visualization) {
  MeteorsUi.prototype.init = function() {
    $('.toggle-summary').on('click', function() {
      $('#summary').toggleClass('minimized').toggleClass('maximized');
    });

    $('#sky-map img').on('click', function() {
      $('#skymap-modal').empty().append($(this).clone()).modal();
    });

    // Set up button handlers.
    setupControlHandlers();
  }

  function setupControlHandlers() {
    $('#restore-view').on('click', function() {
      visualization.clearLock();
      // TODO shouldn't have to call these both.
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
  };
}
