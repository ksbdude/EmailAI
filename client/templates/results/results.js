// 
// Template.results.helpers({
//   retrieveWatsonData: function() {
//     var watson = Meteor.npmRequire('watson-developer-cloud');
//     var watsonOutput = watson.tone_analyzer(watson), function(err, result){
//       //checking for errors in watson call
//       if(error){
//         console.log('FAILED TO APPEND RESULTS FROM WATSON!');
//         return console.error();
//         Session.set('current_route', current_route);
//       } else {
//         $('#watsonData').append(watsonOutput);
//         console.log('WATSON RESULTS APPENDED TO KEY');
//         template.newTemplate('child_added')
//         //TODO: Generate Unique Auth Token on child_added call
//         Session.set('current_route', snapshotKey.val());
//
//       }
//     };
//   }
// });
//
// Template.result.events({
//   "click #foo": function(event, template){
//
//   }
// });
