import { Meteor } from 'meteor/meteor';
import hod from 'havenondemand';


if(Meteor.isServer){
  Meteor.methods({
    havenTest:function(watsonInput){

      // define hod
      var apikey = process.env.HOD_AUTHKEY;
      client = new hod.HODClient(apikey);

      // define some test data
      var testData = {
        'text': watsonInput
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
