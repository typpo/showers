function MeteorsUi(visualization) {
  MeteorsUi.prototype.init = function() {
    $('.toggle-summary').on('click', function() {
      $('#summary').toggleClass('minimized').toggleClass('maximized');
    });

    $('#sky-map img').on('click', function() {
      $('#skymap-modal').empty().append($(this).clone()).modal();
    });

    // Set up button handlers.
    // TODO do this outside of main 3D logic.
    visualization.setupControlHandlers();
  }
}
