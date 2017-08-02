function navigateTo(view) {
  var page = '/view/' + view.replace(/ /g, '-');
  history.replaceState({view: view},
                       'Meteor showers from space - ' + view,
                       page);

  if (typeof mixpanel !== 'undefined') {
    mixpanel.track('meteors', {
      view: view
    });
  }
  if (typeof ga !== 'undefined') {
    ga('send', 'pageview', '/' + page);
  }
}
