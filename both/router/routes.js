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

//routing for about page
Router.route('/about', {
  name: 'about',
});

//generate new route based on id
Router.route('/:_id', {
  name: 'resultsAuth',
});

Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});
