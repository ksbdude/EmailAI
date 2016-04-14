Template.home.rendered = function() {

};

Template.home.events({
  'click #info-button': function(event, template) {
    event.preventDefault();
    Router.go('info');
  }
});
