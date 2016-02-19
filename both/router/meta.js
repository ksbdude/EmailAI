if(Meteor.isClient) {
  Meta.config({
      options: {
        // Meteor.settings[Meteor.settings.environment].public.meta.title
        title: 'emailAI',
        suffix: 'intelligent analysis'
      }
  });
}
