Router.route('/', {
  name: 'home'
});

Router.route('/dashboard', {
  name: 'dashboard',
  controller: 'DashboardController'
});

//routing for input page
Router.route('/demo', {
  name:'demo'
})

//routing for results page
Router.route('/results', {
  name: 'results',
});

Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});
