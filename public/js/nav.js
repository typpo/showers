function navigateTo(view) {
  history.replaceState({view: view},
                       'Meteor showers from space - ' + view,
                       '/meteors/' + view.replace(/ /g, '-'));
}
