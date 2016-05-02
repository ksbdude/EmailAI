import { Meteor } from 'meteor/meteor';

describe('testing gagarin', function() {
    var server = meteor();
    it('should just work', function() {
        return server.execute(function() {
            console.log('sup bro');
        });
    });
});


// unit test for HPE HavenOnDemand
describe('testing hod', function(){
  var server = meteor();
  let watsonInput = 'test string';
  Meteor.call("havenTest", watsonInput);
  it('returns output from HOD', function(callback,err) {
    if (err){
      console.log('error while calling output');
    } else {
      console.log(callback);
    }
  });
});

// test for hod
// it('should return value from hod method', function () {
//   var server = meteor();
//   return server.execute(function () {
//     console.log(havenTest);
//   });
// });
//tests for watson.js
// describe('testing watson.js', function() {
//     var server = meteor();
//     it('returns watson/sparkpost output', function() {
//         return server.execute(function() {
//             Meteor.call(analayzeTone());
//         });
//     });
//
//
// });
