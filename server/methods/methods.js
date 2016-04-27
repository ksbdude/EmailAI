import { Meteor } from 'meteor/meteor';
import hod from 'havenondemand';


if(Meteor.isServer){
  Meteor.methods({
    havenTest:function(){

      // define hod
      var apikey = process.env.HOD_AUTHKEY;
      client = new hod.HODClient(apikey);

      // define some test data
      var testData = {
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      };

      // define callback
      var callback = function(err,resp,body){
        console.log(body);
      };

      // call data
      client.call('analyzesentiment', callback, testData);
    }
  });
}
