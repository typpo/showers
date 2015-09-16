$(function() {
  $('.toggle-summary').on('click', function() {
    $('#summary').toggleClass('minimized').toggleClass('maximized');
  });

  $('#sky-map img').on('click', function() {
    $('#skymap-modal').empty().append($(this).clone()).modal();
  });
});
