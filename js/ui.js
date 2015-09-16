$(function() {
  $('.toggle-summary').on('click', function() {
    $('#summary').toggleClass('minimized').toggleClass('maximized');
  });
});
