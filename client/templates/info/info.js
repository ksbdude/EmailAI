Template.info.events({
  'click #myButton': function(event, template) {
    event.preventDefault();
    Router.go('anotherpath');
  }
});
